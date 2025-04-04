export const useOrderService = () => {
  const tableName = 'Orders';
  const itemsTableName = 'Order Items';
  const apiBase = '/api/airtable';
  
  const getOrders = async () => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}`);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const getOrderById = async (id) => {
    try {
      const order = await $fetch(`${apiBase}/${tableName}/${id}`);
      
      // Get order items for this order
      const items = await $fetch(`${apiBase}/${itemsTableName}`, {
        params: {
          filterByFormula: `{Order} = "${id}"`
        }
      });
      
      return {
        ...order,
        items
      };
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  };

  const createOrder = async (order, items = []) => {
    try {
      // Create the order first
      const createdOrder = await $fetch(`${apiBase}/${tableName}`, {
        method: 'POST',
        body: order
      });
      
      // If there are items, create them with a reference to the order
      if (items.length > 0) {
        const orderItems = items.map(item => ({
          ...item,
          Order: [createdOrder.id]
        }));
        
        // Create order items
        await Promise.all(
          orderItems.map(item => 
            $fetch(`${apiBase}/${itemsTableName}`, {
              method: 'POST',
              body: item
            })
          )
        );
      }
      
      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await $fetch(`${apiBase}/${tableName}/${id}`, {
        method: 'PATCH',
        body: {
          Status: status
        }
      });
      return response;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  };

  return {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
  };
}; 