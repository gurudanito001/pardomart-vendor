# UsersApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**vendorsUsersUserIdGet**](#vendorsusersuseridget) | **GET** /vendors/users/{userId} | Get a single vendor user by their User ID (Admin)|

# **vendorsUsersUserIdGet**
> vendorsUsersUserIdGet()

Retrieves the details of a specific user who has the \'vendor\' role. Intended for admin use.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //The ID of the vendor user to retrieve. (default to undefined)

const { status, data } = await apiInstance.vendorsUsersUserIdGet(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | The ID of the vendor user to retrieve. | defaults to undefined|


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
|**200** | The requested vendor user\&#39;s details. |  -  |
|**404** | Vendor user not found or user is not a vendor. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

