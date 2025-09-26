# CartApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cartCartIdDelete**](#cartcartiddelete) | **DELETE** /cart/{cartId} | Delete a cart by its ID|
|[**cartCartIdGet**](#cartcartidget) | **GET** /cart/{cartId} | Get a specific cart by its ID|
|[**cartGet**](#cartget) | **GET** /cart | Get all carts for the current user|

# **cartCartIdDelete**
> cartCartIdDelete()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let cartId: string; //The ID of the cart to delete. (default to undefined)

const { status, data } = await apiInstance.cartCartIdDelete(
    cartId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cartId** | [**string**] | The ID of the cart to delete. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The cart was deleted successfully. Returns the deleted cart object. |  -  |
|**404** | Cart not found or user does not have permission to delete it. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartCartIdGet**
> Cart cartCartIdGet()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

let cartId: string; //The ID of the cart to retrieve. (default to undefined)

const { status, data } = await apiInstance.cartCartIdGet(
    cartId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cartId** | [**string**] | The ID of the cart to retrieve. | defaults to undefined|


### Return type

**Cart**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested cart object. |  -  |
|**401** | User not authenticated. |  -  |
|**403** | User not authorized to view this cart. |  -  |
|**404** | Cart not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartGet**
> Array<Cart> cartGet()


### Example

```typescript
import {
    CartApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartApi(configuration);

const { status, data } = await apiInstance.cartGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Cart>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s carts, one for each vendor. |  -  |
|**401** | User not authenticated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

