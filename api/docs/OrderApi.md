# OrderApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1OrderOrderIdMessagesGet**](#apiv1orderorderidmessagesget) | **GET** /api/v1/order/{orderId}/messages | Get messages for an order|
|[**apiV1OrderOrderIdMessagesPost**](#apiv1orderorderidmessagespost) | **POST** /api/v1/order/{orderId}/messages | Send a message related to an order|
|[**apiV1OrderOrderIdMessagesReadPatch**](#apiv1orderorderidmessagesreadpatch) | **PATCH** /api/v1/order/{orderId}/messages/read | Mark messages as read|
|[**feesCalculateFeesPost**](#feescalculatefeespost) | **POST** /fees/calculate-fees | Calculate the total estimated cost for an order|
|[**orderDeliverySlotsGet**](#orderdeliveryslotsget) | **GET** /order/delivery-slots | Get available delivery time slots|
|[**orderIdGet**](#orderidget) | **GET** /order/{id} | Get an order by its ID|
|[**orderIdPatch**](#orderidpatch) | **PATCH** /order/{id} | Update an order|
|[**orderIdStatusPatch**](#orderidstatuspatch) | **PATCH** /order/{id}/status | Update the status of an order|
|[**orderOrderIdAcceptPatch**](#orderorderidacceptpatch) | **PATCH** /order/{orderId}/accept | Accept a pending order|
|[**orderOrderIdDeclinePatch**](#orderorderiddeclinepatch) | **PATCH** /order/{orderId}/decline | Decline a pending order|
|[**orderOrderIdItemsItemIdRespondToReplacementPatch**](#orderorderiditemsitemidrespondtoreplacementpatch) | **PATCH** /order/{orderId}/items/{itemId}/respond-to-replacement | Respond to a suggested item replacement|
|[**orderOrderIdItemsItemIdUpdateShoppingStatusPatch**](#orderorderiditemsitemidupdateshoppingstatuspatch) | **PATCH** /order/{orderId}/items/{itemId}/update-shopping-status | Update the shopping status of an order item|
|[**orderOrderIdStartShoppingPatch**](#orderorderidstartshoppingpatch) | **PATCH** /order/{orderId}/start-shopping | Mark an order as \&#39;currently shopping\&#39;|
|[**orderOrderIdTipPatch**](#orderorderidtippatch) | **PATCH** /order/{orderId}/tip | Add or update a tip for an order|
|[**orderPost**](#orderpost) | **POST** /order | Create an order from a client payload|
|[**orderUserMeGet**](#orderusermeget) | **GET** /order/user/me | Get all orders for the authenticated user|
|[**orderVendorOrdersGet**](#ordervendorordersget) | **GET** /order/vendorOrders | Get orders for a vendor\&#39;s dashboard|
|[**ordersOrderIdDeliveryLocationPost**](#ordersorderiddeliverylocationpost) | **POST** /orders/{orderId}/delivery-location | Add a location point for a delivery person|
|[**ordersOrderIdDeliveryPathGet**](#ordersorderiddeliverypathget) | **GET** /orders/{orderId}/delivery-path | Get the delivery path for an order|

# **apiV1OrderOrderIdMessagesGet**
> Array<MessageWithRelations> apiV1OrderOrderIdMessagesGet()

Retrieves the conversation history for a specific order. The user must be a participant in the order (customer, shopper, or delivery person).

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order. (default to undefined)

const { status, data } = await apiInstance.apiV1OrderOrderIdMessagesGet(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | The ID of the order. | defaults to undefined|


### Return type

**Array<MessageWithRelations>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of messages for the order. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not a participant in the order). |  -  |
|**404** | Order not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1OrderOrderIdMessagesPost**
> MessageWithRelations apiV1OrderOrderIdMessagesPost(apiV1OrderOrderIdMessagesPostRequest, )

Sends a message from the authenticated user to another participant (customer, shopper, or delivery person) of the order.

### Example

```typescript
import {
    OrderApi,
    Configuration,
    ApiV1OrderOrderIdMessagesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let apiV1OrderOrderIdMessagesPostRequest: ApiV1OrderOrderIdMessagesPostRequest; //
let orderId: string; //The ID of the order. (default to undefined)

const { status, data } = await apiInstance.apiV1OrderOrderIdMessagesPost(
    apiV1OrderOrderIdMessagesPostRequest,
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1OrderOrderIdMessagesPostRequest** | **ApiV1OrderOrderIdMessagesPostRequest**|  | |
| **orderId** | [**string**] | The ID of the order. | defaults to undefined|


### Return type

**MessageWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created message. |  -  |
|**400** | Bad request (e.g., invalid input). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not a participant in the order or trying to message an invalid recipient). |  -  |
|**404** | Order not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1OrderOrderIdMessagesReadPatch**
> ApiV1OrderOrderIdMessagesReadPatch200Response apiV1OrderOrderIdMessagesReadPatch()

Marks all unread messages for the authenticated user within a specific order as read. This is typically called when the user opens the chat screen.

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order. (default to undefined)

const { status, data } = await apiInstance.apiV1OrderOrderIdMessagesReadPatch(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | The ID of the order. | defaults to undefined|


### Return type

**ApiV1OrderOrderIdMessagesReadPatch200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The number of messages that were marked as read. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not a participant in the order). |  -  |
|**404** | Order not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **feesCalculateFeesPost**
> CalculateFeesResponse feesCalculateFeesPost(calculateFeesPayload)


### Example

```typescript
import {
    OrderApi,
    Configuration,
    CalculateFeesPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let calculateFeesPayload: CalculateFeesPayload; //

const { status, data } = await apiInstance.feesCalculateFeesPost(
    calculateFeesPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calculateFeesPayload** | **CalculateFeesPayload**|  | |


### Return type

**CalculateFeesResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The calculated fees for the order. |  -  |
|**400** | Bad request, invalid payload. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderDeliverySlotsGet**
> Array<DeliverySlot> orderDeliverySlotsGet()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let vendorId: string; //The ID of the vendor. (default to undefined)
let deliveryMethod: DeliveryMethod; //The delivery method for the order. (default to undefined)

const { status, data } = await apiInstance.orderDeliverySlotsGet(
    vendorId,
    deliveryMethod
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | The ID of the vendor. | defaults to undefined|
| **deliveryMethod** | **DeliveryMethod** | The delivery method for the order. | defaults to undefined|


### Return type

**Array<DeliverySlot>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of available delivery dates and time slots. |  -  |
|**400** | Bad request due to missing or invalid parameters. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderIdGet**
> VendorOrder orderIdGet()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; //The ID of the order to retrieve. (default to undefined)

const { status, data } = await apiInstance.orderIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the order to retrieve. | defaults to undefined|


### Return type

**VendorOrder**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested order, with vendor distance and rating included. |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderIdPatch**
> Order orderIdPatch(updateOrderPayload, )


### Example

```typescript
import {
    OrderApi,
    Configuration,
    UpdateOrderPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let updateOrderPayload: UpdateOrderPayload; //
let id: string; //The ID of the order to update. (default to undefined)

const { status, data } = await apiInstance.orderIdPatch(
    updateOrderPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderPayload** | **UpdateOrderPayload**|  | |
| **id** | [**string**] | The ID of the order to update. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order. |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderIdStatusPatch**
> Order orderIdStatusPatch(updateOrderStatusPayload, )


### Example

```typescript
import {
    OrderApi,
    Configuration,
    UpdateOrderStatusPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let updateOrderStatusPayload: UpdateOrderStatusPayload; //
let id: string; //The ID of the order to update. (default to undefined)

const { status, data } = await apiInstance.orderIdStatusPatch(
    updateOrderStatusPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderStatusPayload** | **UpdateOrderStatusPayload**|  | |
| **id** | [**string**] | The ID of the order to update. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order. |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdAcceptPatch**
> Order orderOrderIdAcceptPatch()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order to accept. (default to undefined)

const { status, data } = await apiInstance.orderOrderIdAcceptPatch(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | The ID of the order to accept. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The accepted order. |  -  |
|**400** | Bad request or order cannot be accepted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdDeclinePatch**
> Order orderOrderIdDeclinePatch()


### Example

```typescript
import {
    OrderApi,
    Configuration,
    DeclineOrderPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order to decline. (default to undefined)
let declineOrderPayload: DeclineOrderPayload; // (optional)

const { status, data } = await apiInstance.orderOrderIdDeclinePatch(
    orderId,
    declineOrderPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **declineOrderPayload** | **DeclineOrderPayload**|  | |
| **orderId** | [**string**] | The ID of the order to decline. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The declined order. |  -  |
|**400** | Bad request or order cannot be declined. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdItemsItemIdRespondToReplacementPatch**
> OrderItemWithRelations orderOrderIdItemsItemIdRespondToReplacementPatch(respondToReplacementPayload, )

Allows a customer to approve or reject a replacement suggested by the shopper.

### Example

```typescript
import {
    OrderApi,
    Configuration,
    RespondToReplacementPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let respondToReplacementPayload: RespondToReplacementPayload; //
let orderId: string; // (default to undefined)
let itemId: string; // (default to undefined)

const { status, data } = await apiInstance.orderOrderIdItemsItemIdRespondToReplacementPatch(
    respondToReplacementPayload,
    orderId,
    itemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **respondToReplacementPayload** | **RespondToReplacementPayload**|  | |
| **orderId** | [**string**] |  | defaults to undefined|
| **itemId** | [**string**] |  | defaults to undefined|


### Return type

**OrderItemWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order item. |  -  |
|**400** | Bad request (e.g., no replacement was suggested). |  -  |
|**403** | Forbidden (user does not own this order). |  -  |
|**404** | Order or item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdItemsItemIdUpdateShoppingStatusPatch**
> OrderItemWithRelations orderOrderIdItemsItemIdUpdateShoppingStatusPatch(updateOrderItemShoppingStatusPayload, )

Allows the assigned shopper or delivery person to update an item\'s status during shopping (e.g., found, not found, suggest replacement).

### Example

```typescript
import {
    OrderApi,
    Configuration,
    UpdateOrderItemShoppingStatusPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let updateOrderItemShoppingStatusPayload: UpdateOrderItemShoppingStatusPayload; //
let orderId: string; // (default to undefined)
let itemId: string; // (default to undefined)

const { status, data } = await apiInstance.orderOrderIdItemsItemIdUpdateShoppingStatusPatch(
    updateOrderItemShoppingStatusPayload,
    orderId,
    itemId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderItemShoppingStatusPayload** | **UpdateOrderItemShoppingStatusPayload**|  | |
| **orderId** | [**string**] |  | defaults to undefined|
| **itemId** | [**string**] |  | defaults to undefined|


### Return type

**OrderItemWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order item. |  -  |
|**400** | Bad request (e.g., invalid payload). |  -  |
|**403** | Forbidden (user is not the assigned shopper). |  -  |
|**404** | Order or item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdStartShoppingPatch**
> Order orderOrderIdStartShoppingPatch()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order to start shopping for. (default to undefined)

const { status, data } = await apiInstance.orderOrderIdStartShoppingPatch(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | The ID of the order to start shopping for. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order. |  -  |
|**400** | Bad request or shopping cannot be started for this order. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderOrderIdTipPatch**
> Order orderOrderIdTipPatch(updateTipPayload, )

Allows a customer to add or update tips for the shopper and/or delivery person after an order has been placed. This will recalculate the order\'s total amount.

### Example

```typescript
import {
    OrderApi,
    Configuration,
    UpdateTipPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let updateTipPayload: UpdateTipPayload; //
let orderId: string; //The ID of the order to add a tip to. (default to undefined)

const { status, data } = await apiInstance.orderOrderIdTipPatch(
    updateTipPayload,
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTipPayload** | **UpdateTipPayload**|  | |
| **orderId** | [**string**] | The ID of the order to add a tip to. | defaults to undefined|


### Return type

**Order**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated order with the new tip amount. |  -  |
|**400** | Bad request (e.g., invalid tip amount). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user does not own this order). |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderPost**
> VendorOrder orderPost(createOrderClientPayload)

Creates a new order based on a payload sent from the client, which includes all order items and delivery details. This endpoint is used when the cart state is managed on the client-side.

### Example

```typescript
import {
    OrderApi,
    Configuration,
    CreateOrderClientPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let createOrderClientPayload: CreateOrderClientPayload; //

const { status, data } = await apiInstance.orderPost(
    createOrderClientPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createOrderClientPayload** | **CreateOrderClientPayload**|  | |


### Return type

**VendorOrder**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created order. |  -  |
|**400** | Bad request due to invalid input (e.g., missing fields, invalid time, item out of stock). |  -  |
|**401** | Unauthorized. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderUserMeGet**
> Array<VendorOrder> orderUserMeGet()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

const { status, data } = await apiInstance.orderUserMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<VendorOrder>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s orders. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderVendorOrdersGet**
> Array<VendorOrder> orderVendorOrdersGet()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let status: OrderStatus; //Optional. Filter orders by a specific status. (optional) (default to undefined)

const { status, data } = await apiInstance.orderVendorOrdersGet(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | **OrderStatus** | Optional. Filter orders by a specific status. | (optional) defaults to undefined|


### Return type

**Array<VendorOrder>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of orders for the vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ordersOrderIdDeliveryLocationPost**
> DeliveryPersonLocation ordersOrderIdDeliveryLocationPost(ordersOrderIdDeliveryLocationPostRequest, )

Logs the current geographic coordinates of the delivery person for a specific order. This should be called periodically by the delivery person\'s application. Only the assigned delivery person for the order can post a location.

### Example

```typescript
import {
    OrderApi,
    Configuration,
    OrdersOrderIdDeliveryLocationPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let ordersOrderIdDeliveryLocationPostRequest: OrdersOrderIdDeliveryLocationPostRequest; //
let orderId: string; //The ID of the order being delivered. (default to undefined)

const { status, data } = await apiInstance.ordersOrderIdDeliveryLocationPost(
    ordersOrderIdDeliveryLocationPostRequest,
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ordersOrderIdDeliveryLocationPostRequest** | **OrdersOrderIdDeliveryLocationPostRequest**|  | |
| **orderId** | [**string**] | The ID of the order being delivered. | defaults to undefined|


### Return type

**DeliveryPersonLocation**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Location successfully logged. |  -  |
|**403** | Forbidden. User is not the assigned delivery person for this order. |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ordersOrderIdDeliveryPathGet**
> Array<DeliveryPersonLocation> ordersOrderIdDeliveryPathGet()

Retrieves the historical path of the delivery person for a specific order. This can be used to display the route on a map. Accessible by the customer who placed the order, the assigned delivery person, or an admin.

### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderId: string; //The ID of the order to retrieve the path for. (default to undefined)

const { status, data } = await apiInstance.ordersOrderIdDeliveryPathGet(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | The ID of the order to retrieve the path for. | defaults to undefined|


### Return type

**Array<DeliveryPersonLocation>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | An array of location points, sorted by time. An empty array is returned if no path data exists yet. |  -  |
|**403** | Forbidden. User is not authorized to view this path. |  -  |
|**404** | Order not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

