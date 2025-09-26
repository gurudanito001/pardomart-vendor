# GeneralApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authTimeZonesGet**](#authtimezonesget) | **GET** /auth/time-zones | Get a list of all supported timezones|

# **authTimeZonesGet**
> AuthTimeZonesGet200Response authTimeZonesGet()

Returns a flat list of UTC timezone strings.

### Example

```typescript
import {
    GeneralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralApi(configuration);

const { status, data } = await apiInstance.authTimeZonesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AuthTimeZonesGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of timezones. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

