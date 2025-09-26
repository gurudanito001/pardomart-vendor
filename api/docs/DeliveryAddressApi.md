# DeliveryAddressApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deliveryAddressIdDelete**](#deliveryaddressiddelete) | **DELETE** /deliveryAddress/{id} | Delete a delivery address by its ID|
|[**deliveryAddressIdGet**](#deliveryaddressidget) | **GET** /deliveryAddress/{id} | Get a specific delivery address by its ID|
|[**deliveryAddressIdPut**](#deliveryaddressidput) | **PUT** /deliveryAddress/{id} | Update a delivery address|
|[**deliveryAddressIdSetDefaultPatch**](#deliveryaddressidsetdefaultpatch) | **PATCH** /deliveryAddress/{id}/set-default | Set a delivery address as the default for the authenticated user|
|[**deliveryAddressMeDefaultGet**](#deliveryaddressmedefaultget) | **GET** /deliveryAddress/me/default | Get the default delivery address for the authenticated user|
|[**deliveryAddressMeGet**](#deliveryaddressmeget) | **GET** /deliveryAddress/me | Get all delivery addresses for the authenticated user|
|[**deliveryAddressPost**](#deliveryaddresspost) | **POST** /deliveryAddress | Create a new delivery address for the authenticated user|

# **deliveryAddressIdDelete**
> DeliveryAddress deliveryAddressIdDelete()


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

let id: string; //The ID of the delivery address to delete. (default to undefined)

const { status, data } = await apiInstance.deliveryAddressIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the delivery address to delete. | defaults to undefined|


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted delivery address. |  -  |
|**404** | Delivery address not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressIdGet**
> DeliveryAddress deliveryAddressIdGet()


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

let id: string; //The ID of the delivery address. (default to undefined)

const { status, data } = await apiInstance.deliveryAddressIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the delivery address. | defaults to undefined|


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested delivery address. |  -  |
|**404** | Delivery address not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressIdPut**
> DeliveryAddress deliveryAddressIdPut(updateDeliveryAddressPayload, )


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration,
    UpdateDeliveryAddressPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

let updateDeliveryAddressPayload: UpdateDeliveryAddressPayload; //
let id: string; //The ID of the delivery address to update. (default to undefined)

const { status, data } = await apiInstance.deliveryAddressIdPut(
    updateDeliveryAddressPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateDeliveryAddressPayload** | **UpdateDeliveryAddressPayload**|  | |
| **id** | [**string**] | The ID of the delivery address to update. | defaults to undefined|


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated delivery address. |  -  |
|**404** | Delivery address not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressIdSetDefaultPatch**
> DeliveryAddress deliveryAddressIdSetDefaultPatch()


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

let id: string; //The ID of the delivery address to set as default. (default to undefined)

const { status, data } = await apiInstance.deliveryAddressIdSetDefaultPatch(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the delivery address to set as default. | defaults to undefined|


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated default delivery address. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | Delivery address not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressMeDefaultGet**
> DeliveryAddress deliveryAddressMeDefaultGet()


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

const { status, data } = await apiInstance.deliveryAddressMeDefaultGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The user\&#39;s default delivery address. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | No default address found for this user. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressMeGet**
> Array<DeliveryAddress> deliveryAddressMeGet()


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

const { status, data } = await apiInstance.deliveryAddressMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<DeliveryAddress>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s delivery addresses. |  -  |
|**401** | Unauthorized. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deliveryAddressPost**
> DeliveryAddress deliveryAddressPost(createDeliveryAddressPayload)


### Example

```typescript
import {
    DeliveryAddressApi,
    Configuration,
    CreateDeliveryAddressPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new DeliveryAddressApi(configuration);

let createDeliveryAddressPayload: CreateDeliveryAddressPayload; //

const { status, data } = await apiInstance.deliveryAddressPost(
    createDeliveryAddressPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createDeliveryAddressPayload** | **CreateDeliveryAddressPayload**|  | |


### Return type

**DeliveryAddress**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created delivery address. |  -  |
|**400** | Bad request, required fields are missing. |  -  |
|**401** | Unauthorized. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

