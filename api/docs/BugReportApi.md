# BugReportApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bugReportsIdStatusPatch**](#bugreportsidstatuspatch) | **PATCH** /bug-reports/{id}/status | Update a bug report\&#39;s status (Admin only)|
|[**bugReportsPost**](#bugreportspost) | **POST** /bug-reports | Report a bug|

# **bugReportsIdStatusPatch**
> bugReportsIdStatusPatch(bugReportsIdStatusPatchRequest, )


### Example

```typescript
import {
    BugReportApi,
    Configuration,
    BugReportsIdStatusPatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BugReportApi(configuration);

let bugReportsIdStatusPatchRequest: BugReportsIdStatusPatchRequest; //
let id: string; //The ID of the bug report to update. (default to undefined)

const { status, data } = await apiInstance.bugReportsIdStatusPatch(
    bugReportsIdStatusPatchRequest,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bugReportsIdStatusPatchRequest** | **BugReportsIdStatusPatchRequest**|  | |
| **id** | [**string**] | The ID of the bug report to update. | defaults to undefined|


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
|**200** | Bug report status updated successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **bugReportsPost**
> bugReportsPost()


### Example

```typescript
import {
    BugReportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BugReportApi(configuration);

let description: string; //A description of the bug. (default to undefined)
let image: File; //(Optional) An image of the bug. (optional) (default to undefined)

const { status, data } = await apiInstance.bugReportsPost(
    description,
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **description** | [**string**] | A description of the bug. | defaults to undefined|
| **image** | [**File**] | (Optional) An image of the bug. | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Bug report created successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

