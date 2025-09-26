# CartItemApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cartItemsIdDelete**](#cartitemsiddelete) | **DELETE** /cart-items/{id} | Delete a cart item by its ID|
|[**cartItemsIdGet**](#cartitemsidget) | **GET** /cart-items/{id} | Get a single cart item by its ID|
|[**cartItemsIdPut**](#cartitemsidput) | **PUT** /cart-items/{id} | Update a cart item\&#39;s quantity|
|[**cartItemsPost**](#cartitemspost) | **POST** /cart-items | Add or update an item in the cart.|

# **cartItemsIdDelete**
> CartItemWithProduct cartItemsIdDelete()


### Example

```typescript
import {
    CartItemApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemApi(configuration);

let id: string; //The ID of the cart item to delete. (default to undefined)

const { status, data } = await apiInstance.cartItemsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the cart item to delete. | defaults to undefined|


### Return type

**CartItemWithProduct**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted cart item. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartItemsIdGet**
> CartItemWithProduct cartItemsIdGet()


### Example

```typescript
import {
    CartItemApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemApi(configuration);

let id: string; //The ID of the cart item. (default to undefined)

const { status, data } = await apiInstance.cartItemsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the cart item. | defaults to undefined|


### Return type

**CartItemWithProduct**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested cart item. |  -  |
|**404** | Cart item not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartItemsIdPut**
> CartItemWithProduct cartItemsIdPut(updateCartItemPayload, )


### Example

```typescript
import {
    CartItemApi,
    Configuration,
    UpdateCartItemPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemApi(configuration);

let updateCartItemPayload: UpdateCartItemPayload; //
let id: string; //The ID of the cart item to update. (default to undefined)

const { status, data } = await apiInstance.cartItemsIdPut(
    updateCartItemPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCartItemPayload** | **UpdateCartItemPayload**|  | |
| **id** | [**string**] | The ID of the cart item to update. | defaults to undefined|


### Return type

**CartItemWithProduct**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated cart item. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cartItemsPost**
> Cart cartItemsPost(addCartItemPayload)

Adds an item to the appropriate vendor\'s cart. If a cart for that vendor doesn\'t exist, it\'s created. If the item is already in the cart, its quantity is updated to the new value provided. 

### Example

```typescript
import {
    CartItemApi,
    Configuration,
    AddCartItemPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new CartItemApi(configuration);

let addCartItemPayload: AddCartItemPayload; //

const { status, data } = await apiInstance.cartItemsPost(
    addCartItemPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addCartItemPayload** | **AddCartItemPayload**|  | |


### Return type

**Cart**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Item added or updated successfully. Returns the updated cart. |  -  |
|**400** | Bad request (e.g., product not found, not enough stock). |  -  |
|**401** | User not authenticated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

