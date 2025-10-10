# VendorApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**orderOrderIdAcceptPatch**](#orderorderidacceptpatch) | **PATCH** /order/{orderId}/accept | Accept a pending order|
|[**orderOrderIdDeclinePatch**](#orderorderiddeclinepatch) | **PATCH** /order/{orderId}/decline | Decline a pending order|
|[**orderOrderIdItemsItemIdUpdateShoppingStatusPatch**](#orderorderiditemsitemidupdateshoppingstatuspatch) | **PATCH** /order/{orderId}/items/{itemId}/update-shopping-status | Update the shopping status of an order item|
|[**orderOrderIdStartShoppingPatch**](#orderorderidstartshoppingpatch) | **PATCH** /order/{orderId}/start-shopping | Mark an order as \&#39;currently shopping\&#39;|
|[**orderVendorOrdersGet**](#ordervendorordersget) | **GET** /order/vendorOrders | Get orders for a vendor\&#39;s dashboard|
|[**ordersVendorGet**](#ordersvendorget) | **GET** /orders/vendor | Get all orders for a vendor user\&#39;s stores|
|[**productVendorTrendingGet**](#productvendortrendingget) | **GET** /product/vendor/trending | Get trending vendor products|
|[**transactionsVendorGet**](#transactionsvendorget) | **GET** /transactions/vendor | Get payment transactions for a vendor user|
|[**vendorsGet**](#vendorsget) | **GET** /vendors | Get a paginated list of vendors|
|[**vendorsGetvendorsbyUserIdGet**](#vendorsgetvendorsbyuseridget) | **GET** /vendors/getvendorsby/userId | Get all vendors for the authenticated user|
|[**vendorsIdApprovePatch**](#vendorsidapprovepatch) | **PATCH** /vendors/{id}/approve | Approve a vendor\&#39;s store (Admin)|
|[**vendorsIdDelete**](#vendorsiddelete) | **DELETE** /vendors/{id} | Delete a vendor|
|[**vendorsIdGet**](#vendorsidget) | **GET** /vendors/{id} | Get a vendor by its ID|
|[**vendorsIdPatch**](#vendorsidpatch) | **PATCH** /vendors/{id} | Update a vendor\&#39;s details|
|[**vendorsIdPublishPatch**](#vendorsidpublishpatch) | **PATCH** /vendors/{id}/publish | Publish a vendor\&#39;s store|
|[**vendorsIncompleteSetupsGet**](#vendorsincompletesetupsget) | **GET** /vendors/incomplete-setups | Find vendors with incomplete setup|
|[**vendorsPost**](#vendorspost) | **POST** /vendors | Create a new vendor|

# **orderOrderIdAcceptPatch**
> Order orderOrderIdAcceptPatch()


### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

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
    VendorApi,
    Configuration,
    DeclineOrderPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

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

# **orderOrderIdItemsItemIdUpdateShoppingStatusPatch**
> OrderItemWithRelations orderOrderIdItemsItemIdUpdateShoppingStatusPatch(updateOrderItemShoppingStatusPayload, )

Allows the assigned shopper or delivery person to update an item\'s status during shopping (e.g., found, not found, suggest replacement).

### Example

```typescript
import {
    VendorApi,
    Configuration,
    UpdateOrderItemShoppingStatusPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

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
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

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

# **orderVendorOrdersGet**
> Array<VendorOrder> orderVendorOrdersGet()


### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

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

# **ordersVendorGet**
> Array<Order> ordersVendorGet()

Retrieves a list of all orders for the stores owned by the authenticated vendor user. Can be filtered by a specific `vendorId` (store ID) and/or `orderStatus`. If no `vendorId` is provided, it fetches orders from all stores owned by the user. 

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let vendorId: string; //Optional. Filter orders by a specific store ID owned by the user. (optional) (default to undefined)
let status: OrderStatus; //Optional. Filter orders by a specific status. (optional) (default to undefined)

const { status, data } = await apiInstance.ordersVendorGet(
    vendorId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. Filter orders by a specific store ID owned by the user. | (optional) defaults to undefined|
| **status** | **OrderStatus** | Optional. Filter orders by a specific status. | (optional) defaults to undefined|


### Return type

**Array<Order>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of orders matching the criteria. |  -  |
|**403** | Forbidden if the user tries to access a vendor they do not own. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorTrendingGet**
> PaginatedTrendingVendorProducts productVendorTrendingGet()

Retrieves a list of vendor products that are trending, based on the number of times they have been ordered.

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let vendorId: string; //Optional. Filter trending products by a specific vendor ID. (optional) (default to undefined)
let page: number; //Page number for pagination. (optional) (default to 1)
let size: number; //Number of items per page. (optional) (default to 5)

const { status, data } = await apiInstance.productVendorTrendingGet(
    vendorId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. Filter trending products by a specific vendor ID. | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination. | (optional) defaults to 1|
| **size** | [**number**] | Number of items per page. | (optional) defaults to 5|


### Return type

**PaginatedTrendingVendorProducts**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of trending vendor products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsVendorGet**
> Array<TransactionWithRelations> transactionsVendorGet()

Retrieves a list of all payment-related transactions for stores owned by the authenticated vendor user. Can be filtered by a specific store.

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let vendorId: string; //Optional. The ID of a specific store (vendor) to filter payments for. (optional) (default to undefined)

const { status, data } = await apiInstance.transactionsVendorGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. The ID of a specific store (vendor) to filter payments for. | (optional) defaults to undefined|


### Return type

**Array<TransactionWithRelations>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of payment transactions. |  -  |
|**403** | Forbidden. User is not a vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsGet**
> PaginatedVendors vendorsGet()

Retrieves a list of vendors. Can be filtered by name and sorted by proximity if latitude and longitude are provided. If the user is authenticated, it also returns the number of items in their cart for each vendor.

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let name: string; //Filter vendors by name (case-insensitive search). (optional) (default to undefined)
let latitude: number; //User\'s current latitude to sort vendors by distance. (optional) (default to undefined)
let longitude: number; //User\'s current longitude to sort vendors by distance. (optional) (default to undefined)
let userId: string; //Filter vendors by the user who owns them. (optional) (default to undefined)
let page: number; //Page number for pagination. (optional) (default to 1)
let size: number; //Number of items per page. (optional) (default to 20)

const { status, data } = await apiInstance.vendorsGet(
    name,
    latitude,
    longitude,
    userId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Filter vendors by name (case-insensitive search). | (optional) defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude to sort vendors by distance. | (optional) defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude to sort vendors by distance. | (optional) defaults to undefined|
| **userId** | [**string**] | Filter vendors by the user who owns them. | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination. | (optional) defaults to 1|
| **size** | [**number**] | Number of items per page. | (optional) defaults to 20|


### Return type

**PaginatedVendors**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of vendors. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsGetvendorsbyUserIdGet**
> Array<VendorListItem> vendorsGetvendorsbyUserIdGet()

Retrieves a list of all vendors associated with the currently authenticated user.

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

const { status, data } = await apiInstance.vendorsGetvendorsbyUserIdGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<VendorListItem>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s vendors. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIdApprovePatch**
> Vendor vendorsIdApprovePatch()

Marks a vendor\'s store as verified by setting `isVerified` to true. This is intended to be an admin-only action. 

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let id: string; //The ID of the vendor to approve. (default to undefined)

const { status, data } = await apiInstance.vendorsIdApprovePatch(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor to approve. | defaults to undefined|


### Return type

**Vendor**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The successfully approved vendor. |  -  |
|**404** | Vendor not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIdDelete**
> VendorWithRelations vendorsIdDelete()


### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let id: string; //The ID of the vendor to delete. (default to undefined)

const { status, data } = await apiInstance.vendorsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor to delete. | defaults to undefined|


### Return type

**VendorWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted vendor. |  -  |
|**404** | Vendor not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIdGet**
> VendorWithDetails vendorsIdGet()


### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let id: string; //The ID of the vendor to retrieve. (default to undefined)
let latitude: number; //User\'s current latitude to calculate distance to the vendor. (optional) (default to undefined)
let longitude: number; //User\'s current longitude to calculate distance to the vendor. (optional) (default to undefined)

const { status, data } = await apiInstance.vendorsIdGet(
    id,
    latitude,
    longitude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor to retrieve. | defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude to calculate distance to the vendor. | (optional) defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude to calculate distance to the vendor. | (optional) defaults to undefined|


### Return type

**VendorWithDetails**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested vendor with detailed information including user, opening hours, rating, product/document counts, and distance. |  -  |
|**404** | Vendor not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIdPatch**
> VendorWithRelations vendorsIdPatch(updateVendorPayload, )


### Example

```typescript
import {
    VendorApi,
    Configuration,
    UpdateVendorPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let updateVendorPayload: UpdateVendorPayload; //
let id: string; //The ID of the vendor to update. (default to undefined)

const { status, data } = await apiInstance.vendorsIdPatch(
    updateVendorPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateVendorPayload** | **UpdateVendorPayload**|  | |
| **id** | [**string**] | The ID of the vendor to update. | defaults to undefined|


### Return type

**VendorWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated vendor. |  -  |
|**404** | Vendor not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIdPublishPatch**
> Vendor vendorsIdPublishPatch()

Marks a vendor\'s store as published by setting `isPublished` to true, making it visible to customers. Only the user who owns the vendor can perform this action. 

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let id: string; //The ID of the vendor to publish. (default to undefined)

const { status, data } = await apiInstance.vendorsIdPublishPatch(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor to publish. | defaults to undefined|


### Return type

**Vendor**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The successfully published vendor. |  -  |
|**403** | Forbidden. User does not own this vendor. |  -  |
|**404** | Vendor not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsIncompleteSetupsGet**
> VendorsIncompleteSetupsGet200Response vendorsIncompleteSetupsGet()

Retrieves a list of vendors for the authenticated user that have not completed their setup. A setup is considered incomplete if the vendor has either not added any products OR has uploaded fewer than two documents. 

### Example

```typescript
import {
    VendorApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

const { status, data } = await apiInstance.vendorsIncompleteSetupsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**VendorsIncompleteSetupsGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of vendors with incomplete setups. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vendorsPost**
> VendorWithRelations vendorsPost(createVendorPayload)

Creates a new vendor profile linked to the authenticated user. Default opening hours from 9:00 to 18:00 are created automatically for all days of the week.

### Example

```typescript
import {
    VendorApi,
    Configuration,
    CreateVendorPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorApi(configuration);

let createVendorPayload: CreateVendorPayload; //

const { status, data } = await apiInstance.vendorsPost(
    createVendorPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createVendorPayload** | **CreateVendorPayload**|  | |


### Return type

**VendorWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created vendor with default opening hours. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

