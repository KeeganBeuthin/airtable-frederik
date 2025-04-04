export const useProductService = () => {
  const tableName = 'Products';
  const apiBase = '/api/airtable';
  
  const getProducts = async () => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  };

  return {
    getProducts,
    getProductById
  };
}; 