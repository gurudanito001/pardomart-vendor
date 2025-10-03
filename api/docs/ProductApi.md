# ProductApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productBarcodeGet**](#productbarcodeget) | **GET** /product/barcode | Get a base product by its barcode|
|[**productGet**](#productget) | **GET** /product | Get all base products|
|[**productIdDelete**](#productiddelete) | **DELETE** /product/{id} | Delete a base product|
|[**productIdPatch**](#productidpatch) | **PATCH** /product/{id} | Update a base product|
|[**productPost**](#productpost) | **POST** /product | Create a base product|
|[**productTagsIdsGet**](#producttagsidsget) | **GET** /product/tags/ids | Get base products by tag IDs|
|[**productUserUserIdGet**](#productuseruseridget) | **GET** /product/user/{userId} | Get all products from all vendors belonging to a user|
|[**productVendorBarcodeGet**](#productvendorbarcodeget) | **GET** /product/vendor/barcode | Get a vendor-specific product by barcode|
|[**productVendorBarcodePost**](#productvendorbarcodepost) | **POST** /product/vendor/barcode | Create a vendor product via barcode scan|
|[**productVendorCategoryGet**](#productvendorcategoryget) | **GET** /product/vendor/category | Get vendor products by category|
|[**productVendorGet**](#productvendorget) | **GET** /product/vendor | Get all vendor products with filtering and pagination|
|[**productVendorIdDelete**](#productvendoriddelete) | **DELETE** /product/vendor/{id} | Delete a vendor-specific product|
|[**productVendorIdGet**](#productvendoridget) | **GET** /product/vendor/{id} | Get a vendor-specific product by its ID|
|[**productVendorIdPatch**](#productvendoridpatch) | **PATCH** /product/vendor/{id} | Update a vendor-specific product|
|[**productVendorPost**](#productvendorpost) | **POST** /product/vendor | Create a vendor-specific product|
|[**productVendorTagsIdsGet**](#productvendortagsidsget) | **GET** /product/vendor/tags/ids | Get vendor products by tag IDs|
|[**productVendorTrendingGet**](#productvendortrendingget) | **GET** /product/vendor/trending | Get trending vendor products|

# **productBarcodeGet**
> ProductWithRelations productBarcodeGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let barcode: string; //The barcode of the product to find. (default to undefined)

const { status, data } = await apiInstance.productBarcodeGet(
    barcode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **barcode** | [**string**] | The barcode of the product to find. | defaults to undefined|


### Return type

**ProductWithRelations**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The found product. |  -  |
|**400** | Barcode is required. |  -  |
|**404** | Product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productGet**
> Array<ProductWithRelations> productGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

const { status, data } = await apiInstance.productGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ProductWithRelations>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of all base products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productIdDelete**
> Product productIdDelete()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: string; //The ID of the base product to delete. (default to undefined)

const { status, data } = await apiInstance.productIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the base product to delete. | defaults to undefined|


### Return type

**Product**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted product. |  -  |
|**404** | Product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productIdPatch**
> ProductWithRelations productIdPatch(updateProductBasePayload, )


### Example

```typescript
import {
    ProductApi,
    Configuration,
    UpdateProductBasePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let updateProductBasePayload: UpdateProductBasePayload; //
let id: string; //The ID of the base product to update. (default to undefined)

const { status, data } = await apiInstance.productIdPatch(
    updateProductBasePayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProductBasePayload** | **UpdateProductBasePayload**|  | |
| **id** | [**string**] | The ID of the base product to update. | defaults to undefined|


### Return type

**ProductWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated product. |  -  |
|**404** | Product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productPost**
> ProductWithRelations productPost(createProductPayload)

Creates a new base product in the system. This is the generic version of a product, not tied to a specific vendor.

### Example

```typescript
import {
    ProductApi,
    Configuration,
    CreateProductPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let createProductPayload: CreateProductPayload; //

const { status, data } = await apiInstance.productPost(
    createProductPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProductPayload** | **CreateProductPayload**|  | |


### Return type

**ProductWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created product. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productTagsIdsGet**
> Array<ProductWithRelations> productTagsIdsGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let tagIds: Array<string>; //An array of tag IDs to filter products by. (default to undefined)

const { status, data } = await apiInstance.productTagsIdsGet(
    tagIds
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagIds** | **Array&lt;string&gt;** | An array of tag IDs to filter products by. | defaults to undefined|


### Return type

**Array<ProductWithRelations>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of products matching the tag IDs. |  -  |
|**400** | tagIds query parameter is required. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productUserUserIdGet**
> Array<VendorProduct> productUserUserIdGet()

Retrieves a list of all vendor-specific products from all stores owned by a particular user. This can be used by an admin or the user themselves.

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let userId: string; //The ID of the user whose vendor products are to be fetched. (default to undefined)

const { status, data } = await apiInstance.productUserUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | The ID of the user whose vendor products are to be fetched. | defaults to undefined|


### Return type

**Array<VendorProduct>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of vendor products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorBarcodeGet**
> VendorProductWithRelations productVendorBarcodeGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let barcode: string; //The barcode of the product. (default to undefined)
let vendorId: string; //The ID of the vendor. (default to undefined)

const { status, data } = await apiInstance.productVendorBarcodeGet(
    barcode,
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **barcode** | [**string**] | The barcode of the product. | defaults to undefined|
| **vendorId** | [**string**] | The ID of the vendor. | defaults to undefined|


### Return type

**VendorProductWithRelations**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The found vendor product. |  -  |
|**400** | Barcode and vendorId are required. |  -  |
|**404** | Vendor product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorBarcodePost**
> VendorProductWithRelations productVendorBarcodePost(createVendorProductWithBarcodePayload)

Creates a vendor product by scanning a barcode. If the base product doesn\'t exist, it\'s created first.

### Example

```typescript
import {
    ProductApi,
    Configuration,
    CreateVendorProductWithBarcodePayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let createVendorProductWithBarcodePayload: CreateVendorProductWithBarcodePayload; //

const { status, data } = await apiInstance.productVendorBarcodePost(
    createVendorProductWithBarcodePayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createVendorProductWithBarcodePayload** | **CreateVendorProductWithBarcodePayload**|  | |


### Return type

**VendorProductWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created vendor product. |  -  |
|**409** | Conflict - This product is already listed by this vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorCategoryGet**
> Array<VendorProductWithRelations> productVendorCategoryGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let vendorId: string; //The ID of the vendor. (default to undefined)
let categoryId: string; //The ID of the category. (default to undefined)

const { status, data } = await apiInstance.productVendorCategoryGet(
    vendorId,
    categoryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | The ID of the vendor. | defaults to undefined|
| **categoryId** | [**string**] | The ID of the category. | defaults to undefined|


### Return type

**Array<VendorProductWithRelations>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of vendor products in the specified category. |  -  |
|**400** | Vendor ID and Category ID are required. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorGet**
> PaginatedVendorProducts productVendorGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let name: string; //Filter by product name (case-insensitive contains). (optional) (default to undefined)
let vendorId: string; //Filter by vendor ID. (optional) (default to undefined)
let productId: string; //Filter by base product ID. (optional) (default to undefined)
let categoryIds: Array<string>; //Filter by an array of category IDs. (optional) (default to undefined)
let tagIds: Array<string>; //Filter by an array of tag IDs. (optional) (default to undefined)
let page: number; //Page number for pagination. (optional) (default to 1)
let size: number; //Number of items per page. (optional) (default to 20)

const { status, data } = await apiInstance.productVendorGet(
    name,
    vendorId,
    productId,
    categoryIds,
    tagIds,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Filter by product name (case-insensitive contains). | (optional) defaults to undefined|
| **vendorId** | [**string**] | Filter by vendor ID. | (optional) defaults to undefined|
| **productId** | [**string**] | Filter by base product ID. | (optional) defaults to undefined|
| **categoryIds** | **Array&lt;string&gt;** | Filter by an array of category IDs. | (optional) defaults to undefined|
| **tagIds** | **Array&lt;string&gt;** | Filter by an array of tag IDs. | (optional) defaults to undefined|
| **page** | [**number**] | Page number for pagination. | (optional) defaults to 1|
| **size** | [**number**] | Number of items per page. | (optional) defaults to 20|


### Return type

**PaginatedVendorProducts**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of vendor products. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorIdDelete**
> VendorProduct productVendorIdDelete()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: string; //The ID of the vendor product to delete. (default to undefined)

const { status, data } = await apiInstance.productVendorIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor product to delete. | defaults to undefined|


### Return type

**VendorProduct**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted vendor product. |  -  |
|**404** | Vendor product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorIdGet**
> VendorProductWithRelations productVendorIdGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: string; //The ID of the vendor product to find. (default to undefined)

const { status, data } = await apiInstance.productVendorIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the vendor product to find. | defaults to undefined|


### Return type

**VendorProductWithRelations**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The found vendor product. |  -  |
|**404** | Vendor product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorIdPatch**
> VendorProductWithRelations productVendorIdPatch(updateVendorProductPayload, )


### Example

```typescript
import {
    ProductApi,
    Configuration,
    UpdateVendorProductPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let updateVendorProductPayload: UpdateVendorProductPayload; //
let id: string; //The ID of the vendor product to update. (default to undefined)

const { status, data } = await apiInstance.productVendorIdPatch(
    updateVendorProductPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateVendorProductPayload** | **UpdateVendorProductPayload**|  | |
| **id** | [**string**] | The ID of the vendor product to update. | defaults to undefined|


### Return type

**VendorProductWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated vendor product. |  -  |
|**404** | Vendor product not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorPost**
> VendorProductWithRelations productVendorPost(createVendorProductPayload)

Creates a product listing for a specific vendor.

### Example

```typescript
import {
    ProductApi,
    Configuration,
    CreateVendorProductPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let createVendorProductPayload: CreateVendorProductPayload; //

const { status, data } = await apiInstance.productVendorPost(
    createVendorProductPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createVendorProductPayload** | **CreateVendorProductPayload**|  | |


### Return type

**VendorProductWithRelations**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created vendor product. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorTagsIdsGet**
> Array<VendorProductWithRelations> productVendorTagsIdsGet()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let tagIds: Array<string>; //An array of tag IDs to filter vendor products by. (default to undefined)

const { status, data } = await apiInstance.productVendorTagsIdsGet(
    tagIds
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagIds** | **Array&lt;string&gt;** | An array of tag IDs to filter vendor products by. | defaults to undefined|


### Return type

**Array<VendorProductWithRelations>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of vendor products matching the tag IDs. |  -  |
|**400** | tagIds query parameter is required. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productVendorTrendingGet**
> PaginatedTrendingVendorProducts productVendorTrendingGet()

Retrieves a list of vendor products that are trending, based on the number of times they have been ordered.

### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

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

