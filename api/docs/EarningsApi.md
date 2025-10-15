# EarningsApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**earningsGet**](#earningsget) | **GET** /earnings | List earnings for a vendor|
|[**earningsTotalGet**](#earningstotalget) | **GET** /earnings/total | Get total earnings for a vendor|

# **earningsGet**
> Array<Transaction> earningsGet()

Retrieves a list of all earnings (vendor payouts) for the authenticated vendor owner. Can be filtered by a specific `vendorId` (store ID) to see earnings for just one store. 

### Example

```typescript
import {
    EarningsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EarningsApi(configuration);

let vendorId: string; //Optional. Filter earnings for a specific store. (optional) (default to undefined)

const { status, data } = await apiInstance.earningsGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. Filter earnings for a specific store. | (optional) defaults to undefined|


### Return type

**Array<Transaction>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of earnings transactions. |  -  |
|**403** | Forbidden. The user is not a vendor or does not own the specified store. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **earningsTotalGet**
> EarningsTotalGet200Response earningsTotalGet()

Calculates and returns the total earnings for the authenticated vendor owner. The total can be filtered by a specific time period. 

### Example

```typescript
import {
    EarningsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EarningsApi(configuration);

let period: 'today' | '7days' | '1month' | '1year'; //Optional. The time period to calculate earnings for. - `today`: From the beginning of the current day. - `7days`: For the last 7 days. - `1month`: For the last 1 month. - `1year`: For the last 1 year. If omitted, total earnings of all time are returned.  (optional) (default to undefined)

const { status, data } = await apiInstance.earningsTotalGet(
    period
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **period** | [**&#39;today&#39; | &#39;7days&#39; | &#39;1month&#39; | &#39;1year&#39;**]**Array<&#39;today&#39; &#124; &#39;7days&#39; &#124; &#39;1month&#39; &#124; &#39;1year&#39;>** | Optional. The time period to calculate earnings for. - &#x60;today&#x60;: From the beginning of the current day. - &#x60;7days&#x60;: For the last 7 days. - &#x60;1month&#x60;: For the last 1 month. - &#x60;1year&#x60;: For the last 1 year. If omitted, total earnings of all time are returned.  | (optional) defaults to undefined|


### Return type

**EarningsTotalGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The total earnings amount. |  -  |
|**403** | Forbidden. The user is not a vendor. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

