# GeneralApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authCountriesGet**](#authcountriesget) | **GET** /auth/countries | Get countries from Rest Countries API|
|[**authStaticCountriesGet**](#authstaticcountriesget) | **GET** /auth/static-countries | Get a list of static country data|
|[**authTimeZonesGet**](#authtimezonesget) | **GET** /auth/time-zones | Get a list of all supported timezones|

# **authCountriesGet**
> authCountriesGet()

Returns a list of countries or searches for a specific one. This endpoint is completely open.

### Example

```typescript
import {
    GeneralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralApi(configuration);

let search: string; //Optional search term (e.g., \'canada\'). (optional) (default to undefined)

const { status, data } = await apiInstance.authCountriesGet(
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Optional search term (e.g., \&#39;canada\&#39;). | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of countries. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authStaticCountriesGet**
> Array<Country> authStaticCountriesGet()

Returns a list of simplified country objects (name, iso2, dialCode, flagPng, flagSvg) from a local static file. This endpoint is completely open and does not require authentication.

### Example

```typescript
import {
    GeneralApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GeneralApi(configuration);

const { status, data } = await apiInstance.authStaticCountriesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Country>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of static country data, sorted alphabetically by name. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

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

