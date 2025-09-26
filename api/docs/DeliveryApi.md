# DeliveryApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ordersOrderIdDeliveryLocationPost**](#ordersorderiddeliverylocationpost) | **POST** /orders/{orderId}/delivery-location | Add a location point for a delivery person|
|[**ordersOrderIdDeliveryPathGet**](#ordersorderiddeliverypathget) | **GET** /orders/{orderId}/delivery-path | Get the delivery path for an order|

# **ordersOrderIdDeliveryLocationPost**
> DeliveryPersonLocation ordersOrderIdDeliveryLocationPost(ordersOrderIdDeliveryLocationPostRequest, )

Logs the current geographic coordinates of the delivery person for a specific order. This should be called periodically by the delivery person\'s application. Only the assigned delivery person for the order can post a location.

### Example

```typescript
import {
    DeliveryApi,
    Configuration,
    OrdersOrderIdDeliveryLocationPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryApi(configuration);

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
    DeliveryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryApi(configuration);

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

