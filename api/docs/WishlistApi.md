# WishlistApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**wishlistGet**](#wishlistget) | **GET** /wishlist | Get the user\&#39;s wishlist|
|[**wishlistIdDelete**](#wishlistiddelete) | **DELETE** /wishlist/{id} | Remove an item from the wishlist|
|[**wishlistPost**](#wishlistpost) | **POST** /wishlist | Add a product to the wishlist|

# **wishlistGet**
> Array<WishlistItemWithRelations> wishlistGet()


### Example

```typescript
import {
    WishlistApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WishlistApi(configuration);

const { status, data } = await apiInstance.wishlistGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<WishlistItemWithRelations>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of items in the user\&#39;s wishlist. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **wishlistIdDelete**
> WishlistItem wishlistIdDelete()


### Example

```typescript
import {
    WishlistApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WishlistApi(configuration);

let id: string; //The ID of the wishlist item to remove. (default to undefined)

const { status, data } = await apiInstance.wishlistIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the wishlist item to remove. | defaults to undefined|


### Return type

**WishlistItem**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The removed item. |  -  |
|**403** | Forbidden. |  -  |
|**404** | Wishlist item not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **wishlistPost**
> WishlistItem wishlistPost(createWishlistItemPayload)


### Example

```typescript
import {
    WishlistApi,
    Configuration,
    CreateWishlistItemPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new WishlistApi(configuration);

let createWishlistItemPayload: CreateWishlistItemPayload; //

const { status, data } = await apiInstance.wishlistPost(
    createWishlistItemPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createWishlistItemPayload** | **CreateWishlistItemPayload**|  | |


### Return type

**WishlistItem**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The item added to the wishlist. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Product not found. |  -  |
|**409** | Product already in wishlist. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

