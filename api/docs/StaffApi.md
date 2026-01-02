# StaffApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**staffAdminStaffIdGet**](#staffadminstaffidget) | **GET** /staff/admin/{staffId} | Get a single staff member by ID (Admin)|
|[**staffAdminStoreVendorIdGet**](#staffadminstorevendoridget) | **GET** /staff/admin/store/{vendorId} | List all staff for a specific store (Admin)|
|[**staffGet**](#staffget) | **GET** /staff | List staff members based on user role|
|[**staffPost**](#staffpost) | **POST** /staff | Create a new staff member (shopper) for a vendor|
|[**staffStaffIdDelete**](#staffstaffiddelete) | **DELETE** /staff/{staffId} | Delete a staff member\&#39;s account|
|[**staffStaffIdGet**](#staffstaffidget) | **GET** /staff/{staffId} | Get a single staff member by ID|
|[**staffStaffIdPatch**](#staffstaffidpatch) | **PATCH** /staff/{staffId} | Update a staff member\&#39;s details|
|[**staffStoreVendorIdGet**](#staffstorevendoridget) | **GET** /staff/store/{vendorId} | List all staff members for a specific store|
|[**staffTransactionsGet**](#stafftransactionsget) | **GET** /staff/transactions | List all transactions for a vendor\&#39;s staff|

# **staffAdminStaffIdGet**
> staffAdminStaffIdGet()

Retrieves the details of a specific staff member by their user ID. Only accessible by admins.

### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffId: string; //The user ID of the staff member. (default to undefined)

const { status, data } = await apiInstance.staffAdminStaffIdGet(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] | The user ID of the staff member. | defaults to undefined|


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
|**404** | Staff member not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **staffAdminStoreVendorIdGet**
> staffAdminStoreVendorIdGet()

Retrieves a list of all staff members (store_admin, store_shopper) for a given store ID. Only accessible by admins.

### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let vendorId: string; //The ID of the store. (default to undefined)

const { status, data } = await apiInstance.staffAdminStoreVendorIdGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | The ID of the store. | defaults to undefined|


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
|**403** | Forbidden. |  -  |
|**404** | Vendor not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **staffGet**
> staffGet()

Retrieves a list of staff members with role-based access control: - **Vendor**: Can see all staff members across all of their stores. Can filter by a specific `vendorId` they own. - **Store Admin**: Can only see staff members from their assigned store. The `vendorId` filter is ignored. - **Store Shopper**: Not authorized to use this endpoint. 

### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let vendorId: string; //Optional. For Vendors, filters staff by a specific store ID. Ignored for other roles. (optional) (default to undefined)

const { status, data } = await apiInstance.staffGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. For Vendors, filters staff by a specific store ID. Ignored for other roles. | (optional) defaults to undefined|


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
|**200** | A list of staff members. |  -  |
|**403** | Forbidden. The user is not authorized to view staff for the specified store. |  -  |
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

# **staffTransactionsGet**
> staffTransactionsGet()

Retrieves a list of transactions performed by staff members, with role-based access: - **Vendor**: Can see transactions from all staff across all their stores. Can filter by `staffUserId` and/or `vendorId`. - **Store Admin**: Can only see transactions from staff in their assigned store. The `vendorId` filter is ignored if provided. 

### Example

```typescript
import {
    StaffApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffApi(configuration);

let staffUserId: string; //Optional. Filter transactions for a specific staff member (shopper or admin). (optional) (default to undefined)
let vendorId: string; //Optional. For Vendors, filters transactions for staff at a specific store. For Store Admins, this is ignored. (optional) (default to undefined)

const { status, data } = await apiInstance.staffTransactionsGet(
    staffUserId,
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffUserId** | [**string**] | Optional. Filter transactions for a specific staff member (shopper or admin). | (optional) defaults to undefined|
| **vendorId** | [**string**] | Optional. For Vendors, filters transactions for staff at a specific store. For Store Admins, this is ignored. | (optional) defaults to undefined|


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
|**200** | A list of staff transactions. |  -  |
|**403** | Forbidden if the user tries to access a vendor or staff they do not own. |  -  |
|**404** | Not Found if the specified &#x60;staffUserId&#x60; or &#x60;vendorId&#x60; does not exist. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

