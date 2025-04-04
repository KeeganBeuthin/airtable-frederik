export const useCustomerService = () => {
  const tableName = 'Customers';
  const apiBase = '/api/airtable';
  
  const getCustomers = async () => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`);
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  };

  const getCustomerById = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  };

  const createCustomer = async (customer) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`, {
        method: 'POST',
        body: customer
      });
      return response;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id, fields) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`, {
        method: 'PATCH',
        body: fields
      });
      return response;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  };

  return {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}; 