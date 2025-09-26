# GeneralSearchApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**generalSearchCategoryCategoryIdGet**](#generalsearchcategorycategoryidget) | **GET** /generalSearch/category/{categoryId} | Find stores by category ID|
|[**generalSearchCategoryGet**](#generalsearchcategoryget) | **GET** /generalSearch/category | Find stores by category name|
|[**generalSearchProductGet**](#generalsearchproductget) | **GET** /generalSearch/product | Find stores that sell a specific product|
|[**generalSearchStoreGet**](#generalsearchstoreget) | **GET** /generalSearch/store | Find stores by name|
|[**generalSearchStoreProductsStoreIdGet**](#generalsearchstoreproductsstoreidget) | **GET** /generalSearch/storeProducts/{storeId} | Search for products within a specific store|

# **generalSearchCategoryCategoryIdGet**
> StoresByProductResult generalSearchCategoryCategoryIdGet()

Searches for a category by ID and returns a list of stores that sell products in that category (and its sub-categories), sorted by proximity to the user.

### Example

```typescript
import {
    GeneralSearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralSearchApi(configuration);

let categoryId: string; //The ID of the category to search for. (default to undefined)
let latitude: number; //User\'s current latitude. (default to undefined)
let longitude: number; //User\'s current longitude. (default to undefined)

const { status, data } = await apiInstance.generalSearchCategoryCategoryIdGet(
    categoryId,
    latitude,
    longitude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryId** | [**string**] | The ID of the category to search for. | defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude. | defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude. | defaults to undefined|


### Return type

**StoresByProductResult**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of stores matching the category search, sorted by distance. |  -  |
|**400** | Bad request due to missing or invalid parameters. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generalSearchCategoryGet**
> StoresByProductResult generalSearchCategoryGet()

Searches for a category by name and returns a list of stores that sell products in that category, sorted by proximity to the user.

### Example

```typescript
import {
    GeneralSearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralSearchApi(configuration);

let search: string; //The name of the category to search for. (default to undefined)
let latitude: number; //User\'s current latitude. (default to undefined)
let longitude: number; //User\'s current longitude. (default to undefined)

const { status, data } = await apiInstance.generalSearchCategoryGet(
    search,
    latitude,
    longitude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | The name of the category to search for. | defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude. | defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude. | defaults to undefined|


### Return type

**StoresByProductResult**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of stores matching the category search, sorted by distance. |  -  |
|**400** | Bad request due to missing or invalid parameters. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generalSearchProductGet**
> StoresByProductResult generalSearchProductGet()

Searches for a product by name and returns a list of stores that sell it, sorted by proximity to the user. Each store result includes other products they sell.

### Example

```typescript
import {
    GeneralSearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralSearchApi(configuration);

let search: string; //The name of the product to search for. (default to undefined)
let latitude: number; //User\'s current latitude. (default to undefined)
let longitude: number; //User\'s current longitude. (default to undefined)

const { status, data } = await apiInstance.generalSearchProductGet(
    search,
    latitude,
    longitude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | The name of the product to search for. | defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude. | defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude. | defaults to undefined|


### Return type

**StoresByProductResult**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of stores selling the product, sorted by distance. |  -  |
|**400** | Bad request due to missing or invalid parameters. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generalSearchStoreGet**
> StoresByProductResult generalSearchStoreGet()

Searches for a store by name and returns a list of stores, sorted by proximity to the user. Each store result includes products they sell.

### Example

```typescript
import {
    GeneralSearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralSearchApi(configuration);

let search: string; //The name of the store to search for. (default to undefined)
let latitude: number; //User\'s current latitude. (default to undefined)
let longitude: number; //User\'s current longitude. (default to undefined)

const { status, data } = await apiInstance.generalSearchStoreGet(
    search,
    latitude,
    longitude
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | The name of the store to search for. | defaults to undefined|
| **latitude** | [**number**] | User\&#39;s current latitude. | defaults to undefined|
| **longitude** | [**number**] | User\&#39;s current longitude. | defaults to undefined|


### Return type

**StoresByProductResult**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of stores matching the search, sorted by distance. |  -  |
|**400** | Bad request due to missing or invalid parameters. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generalSearchStoreProductsStoreIdGet**
> GeneralSearchStoreProductsStoreIdGet200Response generalSearchStoreProductsStoreIdGet()

Searches for products within a specific store, optionally filtering by a search term and/or category. If no categoryId is provided, it returns products grouped by their parent category. If a categoryId is provided, it returns a flat list of products within that category. 

### Example

```typescript
import {
    GeneralSearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralSearchApi(configuration);

let storeId: string; //The ID of the store (vendor) to search within. (default to undefined)
let searchTerm: string; //The search term to filter products by name. (optional) (default to undefined)
let categoryId: string; //The ID of the category to filter products by. If provided, results will not be grouped. (optional) (default to undefined)

const { status, data } = await apiInstance.generalSearchStoreProductsStoreIdGet(
    storeId,
    searchTerm,
    categoryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **storeId** | [**string**] | The ID of the store (vendor) to search within. | defaults to undefined|
| **searchTerm** | [**string**] | The search term to filter products by name. | (optional) defaults to undefined|
| **categoryId** | [**string**] | The ID of the category to filter products by. If provided, results will not be grouped. | (optional) defaults to undefined|


### Return type

**GeneralSearchStoreProductsStoreIdGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of products from the store. The structure depends on whether &#x60;categoryId&#x60; is provided. |  -  |
|**400** | Bad request due to missing storeId. |  -  |
|**404** | Store not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

