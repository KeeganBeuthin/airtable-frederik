import Airtable from 'airtable';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { airtableApiKey, airtableBaseId } = config;
  
  if (!airtableApiKey || !airtableBaseId) {
    throw createError({
      statusCode: 500,
      message: 'Airtable configuration is missing'
    });
  }
  
  // Configure Airtable
  Airtable.configure({
    apiKey: airtableApiKey
  });
  
  const base = Airtable.base(airtableBaseId);
  const method = getMethod(event);
  const path = event.context.params._ || '';
  
  // Split the path: [tableName, recordId, ...rest]
  const pathParts = path.split('/');
  const tableName = pathParts[0];
  const recordId = pathParts[1];
  
  if (!tableName) {
    throw createError({
      statusCode: 400,
      message: 'Table name is required'
    });
  }
  
  try {
    // GET requests
    if (method === 'GET') {
      // Get query parameters
      const query = getQuery(event);
      
      // Get a specific record
      if (recordId) {
        const record = await base(tableName).find(recordId);
        return { 
          id: record.id,
          ...record.fields
        };
      }
      
      // Prepare filter formula if provided
      let filterOptions = {};
      
      if (query.filterByFormula) {
        filterOptions.filterByFormula = query.filterByFormula;
      }
      
      if (query.maxRecords) {
        filterOptions.maxRecords = parseInt(query.maxRecords);
      }
      
      if (query.sort) {
        try {
          filterOptions.sort = JSON.parse(query.sort);
        } catch (e) {
          console.error('Invalid sort parameter', e);
        }
      }
      
      // Get all records from a table
      const records = await new Promise((resolve, reject) => {
        const allRecords = [];
        base(tableName)
          .select(filterOptions)
          .eachPage(
            (records, fetchNextPage) => {
              records.forEach(record => {
                allRecords.push({
                  id: record.id,
                  ...record.fields
                });
              });
              fetchNextPage();
            },
            (error) => {
              if (error) reject(error);
              else resolve(allRecords);
            }
          );
      });
      
      return records;
    }
    
    // POST request to create records
    if (method === 'POST') {
      const body = await readBody(event);
      const createdRecord = await base(tableName).create(body);
      return {
        id: createdRecord.id,
        ...createdRecord.fields
      };
    }
    
    // PATCH request to update a record
    if (method === 'PATCH' && recordId) {
      const body = await readBody(event);
      const updatedRecord = await base(tableName).update(recordId, body);
      return {
        id: updatedRecord.id,
        ...updatedRecord.fields
      };
    }
    
    // DELETE request to delete a record
    if (method === 'DELETE' && recordId) {
      const deletedRecord = await base(tableName).destroy(recordId);
      return {
        id: deletedRecord.id,
        deleted: true
      };
    }
    
    throw createError({
      statusCode: 400,
      message: 'Invalid request'
    });
  } catch (error) {
    console.error('Airtable API Error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred with the Airtable API'
    });
  }
});
