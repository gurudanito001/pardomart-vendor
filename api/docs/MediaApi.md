# MediaApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mediaUploadPost**](#mediauploadpost) | **POST** /media/upload | Upload a media file|

# **mediaUploadPost**
> mediaUploadPost()

Uploads a file (image, document, etc.) to the server. The file is stored on Cloudinary, and a corresponding record is created in the database. This endpoint requires a `multipart/form-data` request. 

### Example

```typescript
import {
    MediaApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaApi(configuration);

let file: File; //The file to upload. (default to undefined)
let referenceId: string; //The ID of the resource this media is associated with (e.g., a user ID, product ID). (default to undefined)
let referenceType: string; //The name of the model this media is associated with (e.g., \\\"User\\\", \\\"Product\\\", \\\"Vendor\\\"). (default to undefined)

const { status, data } = await apiInstance.mediaUploadPost(
    file,
    referenceId,
    referenceType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | The file to upload. | defaults to undefined|
| **referenceId** | [**string**] | The ID of the resource this media is associated with (e.g., a user ID, product ID). | defaults to undefined|
| **referenceType** | [**string**] | The name of the model this media is associated with (e.g., \\\&quot;User\\\&quot;, \\\&quot;Product\\\&quot;, \\\&quot;Vendor\\\&quot;). | defaults to undefined|


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
|**201** | File uploaded successfully. Returns Cloudinary response. |  -  |
|**400** | Bad request (e.g., no file uploaded, missing referenceId or referenceType). |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

