export const useMeasurementService = () => {
  const tableName = 'Measurements';
  const apiBase = '/api/airtable';
  
  const getMeasurements = async () => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`);
      return response;
    } catch (error) {
      console.error('Error fetching measurements:', error);
      throw error;
    }
  };

  const getMeasurementById = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching measurement ${id}:`, error);
      throw error;
    }
  };

  const getMeasurementsByOrder = async (orderId) => {
    try {
      const all = await getMeasurements();
      return all.filter(m => m.Order && m.Order.includes(orderId));
    } catch (error) {
      console.error(`Error fetching measurements for order ${orderId}:`, error);
      throw error;
    }
  };

  const createMeasurement = async (measurement) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`, {
        method: 'POST',
        body: measurement
      });
      return response;
    } catch (error) {
      console.error('Error creating measurement:', error);
      throw error;
    }
  };

  const updateMeasurement = async (id, fields) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`, {
        method: 'PATCH',
        body: fields
      });
      return response;
    } catch (error) {
      console.error(`Error updating measurement ${id}:`, error);
      throw error;
    }
  };

  return {
    getMeasurements,
    getMeasurementById,
    getMeasurementsByOrder,
    createMeasurement,
    updateMeasurement
  };
}; 