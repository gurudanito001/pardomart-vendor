# StaffApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1StaffGet**](#apiv1staffget) | **GET** /api/v1/staff | List all staff members for the authenticated vendor owner|
|[**apiV1StaffPost**](#apiv1staffpost) | **POST** /api/v1/staff | Create a new staff member (shopper) for a vendor|
|[**apiV1StaffStaffIdDelete**](#apiv1staffstaffiddelete) | **DELETE** /api/v1/staff/{staffId} | Delete a staff member\&#39;s account|
|[**apiV1StaffStaffIdGet**](#apiv1staffstaffidget) | **GET** /api/v1/staff/{staffId} | Get a single staff member by ID|
|[**apiV1StaffStaffIdPatch**](#apiv1staffstaffidpatch) | **PATCH** /api/v1/staff/{staffId} | Update a staff member\&#39;s details|
|[**apiV1StaffStoreVendorIdGet**](#apiv1staffstorevendoridget) | **GET** /api/v1/staff/store/{vendorId} | List all staff members for a specific store|

# **apiV1StaffGet**
> apiV1StaffGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

const { status, data } = await apiInstance.apiV1StaffGet();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | A list of all staff members across all stores. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1StaffPost**
> apiV1StaffPost(apiV1StaffPostRequest)


### Example

```typescript
import {
    StaffApi,
    Configuration,
    ApiV1StaffPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let apiV1StaffPostRequest: ApiV1StaffPostRequest; //

const { status, data } = await apiInstance.apiV1StaffPost(
    apiV1StaffPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1StaffPostRequest** | **ApiV1StaffPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Staff account created successfully. |  -  |
|**403** | Forbidden. The authenticated user does not own the vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1StaffStaffIdDelete**
> apiV1StaffStaffIdDelete()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1StaffStaffIdDelete(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


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
|**204** | Staff member deleted successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1StaffStaffIdGet**
> apiV1StaffStaffIdGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1StaffStaffIdGet(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


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
|**200** | The requested staff member. |  -  |
|**403** | Forbidden. |  -  |
|**404** | Staff member not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1StaffStaffIdPatch**
> apiV1StaffStaffIdPatch(apiV1StaffStaffIdPatchRequest, )


### Example

```typescript
import {
    StaffApi,
    Configuration,
    ApiV1StaffStaffIdPatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let apiV1StaffStaffIdPatchRequest: ApiV1StaffStaffIdPatchRequest; //
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1StaffStaffIdPatch(
    apiV1StaffStaffIdPatchRequest,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1StaffStaffIdPatchRequest** | **ApiV1StaffStaffIdPatchRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated staff member. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1StaffStoreVendorIdGet**
> apiV1StaffStoreVendorIdGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let vendorId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1StaffStoreVendorIdGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] |  | defaults to undefined|


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
|**200** | A list of staff members for the specified store. |  -  |
|**403** | Forbidden. The authenticated user does not own the vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

