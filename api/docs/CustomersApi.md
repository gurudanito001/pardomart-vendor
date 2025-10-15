# CustomersApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customersCustomerIdTransactionsGet**](#customerscustomeridtransactionsget) | **GET** /customers/{customerId}/transactions | List all transactions for a specific customer|
|[**customersGet**](#customersget) | **GET** /customers | List customers for a vendor, admin, or shopper|

# **customersCustomerIdTransactionsGet**
> Array<Transaction> customersCustomerIdTransactionsGet()

Retrieves a list of all transactions for a given customer, with role-based access: - **Vendor**: Can view all transactions for the customer across all their stores. Can optionally filter by a specific `vendorId` (store ID). - **Store Admin**: Can only view transactions for the customer within their assigned store. The `vendorId` filter is ignored. 

### Example

```typescript
import {
    CustomersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let customerId: string; //The ID of the customer. (default to undefined)
let vendorId: string; //Optional. For Vendors, filters transactions by a specific store ID. Ignored for other roles. (optional) (default to undefined)

const { status, data } = await apiInstance.customersCustomerIdTransactionsGet(
    customerId,
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerId** | [**string**] | The ID of the customer. | defaults to undefined|
| **vendorId** | [**string**] | Optional. For Vendors, filters transactions by a specific store ID. Ignored for other roles. | (optional) defaults to undefined|


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
|**200** | A list of the customer\&#39;s transactions. |  -  |
|**403** | Forbidden. The authenticated user does not have permission. |  -  |
|**404** | Not Found. The customer has no history with the specified vendor(s). |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersGet**
> Array<UserSummary> customersGet()

Retrieves a list of unique customers who have patronized a store. - **Vendor**: Can see customers from all their stores. Can filter by a specific `vendorId`. - **Store Admin/Shopper**: Can only see customers from their assigned store. The `vendorId` filter is ignored. 

### Example

```typescript
import {
    CustomersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let vendorId: string; //Optional. For vendors, filters customers by a specific store ID. For staff, this parameter is ignored. (optional) (default to undefined)

const { status, data } = await apiInstance.customersGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. For vendors, filters customers by a specific store ID. For staff, this parameter is ignored. | (optional) defaults to undefined|


### Return type

**Array<UserSummary>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of customers who have made a purchase from the vendor\&#39;s store(s). |  -  |
|**403** | Forbidden. The authenticated user does not have permission. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

