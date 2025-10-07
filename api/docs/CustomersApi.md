# CustomersApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customersGet**](#customersget) | **GET** /customers | List customers for a vendor account or a specific store|

# **customersGet**
> customersGet()


### Example

```typescript
import {
    CustomersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let vendorId: string; //Optional. The ID of a specific store to filter customers for. If omitted, returns customers from all stores. (optional) (default to undefined)

const { status, data } = await apiInstance.customersGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. The ID of a specific store to filter customers for. If omitted, returns customers from all stores. | (optional) defaults to undefined|


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
|**200** | A list of customers who have made a purchase. |  -  |
|**403** | Forbidden. The authenticated user does not own the specified vendor. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

