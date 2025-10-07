# StaffApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**staffGet**](#staffget) | **GET** /staff | List all staff members for the authenticated vendor owner|
|[**staffPost**](#staffpost) | **POST** /staff | Create a new staff member (shopper) for a vendor|
|[**staffStaffIdDelete**](#staffstaffiddelete) | **DELETE** /staff/{staffId} | Delete a staff member\&#39;s account|
|[**staffStaffIdGet**](#staffstaffidget) | **GET** /staff/{staffId} | Get a single staff member by ID|
|[**staffStaffIdPatch**](#staffstaffidpatch) | **PATCH** /staff/{staffId} | Update a staff member\&#39;s details|
|[**staffStoreVendorIdGet**](#staffstorevendoridget) | **GET** /staff/store/{vendorId} | List all staff members for a specific store|

# **staffGet**
> staffGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

const { status, data } = await apiInstance.staffGet();
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

# **staffPost**
> staffPost(staffPostRequest)


### Example

```typescript
import {
    StaffApi,
    Configuration,
    StaffPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffPostRequest: StaffPostRequest; //

const { status, data } = await apiInstance.staffPost(
    staffPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffPostRequest** | **StaffPostRequest**|  | |


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

# **staffStaffIdDelete**
> staffStaffIdDelete()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.staffStaffIdDelete(
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

# **staffStaffIdGet**
> staffStaffIdGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.staffStaffIdGet(
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

# **staffStaffIdPatch**
> staffStaffIdPatch(staffStaffIdPatchRequest, )


### Example

```typescript
import {
    StaffApi,
    Configuration,
    StaffStaffIdPatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffStaffIdPatchRequest: StaffStaffIdPatchRequest; //
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.staffStaffIdPatch(
    staffStaffIdPatchRequest,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffStaffIdPatchRequest** | **StaffStaffIdPatchRequest**|  | |
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

# **staffStoreVendorIdGet**
> staffStoreVendorIdGet()


### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let vendorId: string; // (default to undefined)

const { status, data } = await apiInstance.staffStoreVendorIdGet(
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

