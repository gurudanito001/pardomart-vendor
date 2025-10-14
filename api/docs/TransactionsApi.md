# TransactionsApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**staffTransactionsGet**](#stafftransactionsget) | **GET** /staff/transactions | List all transactions for a vendor\&#39;s staff|
|[**transactionsGet**](#transactionsget) | **GET** /transactions | List transactions based on user role|

# **staffTransactionsGet**
> staffTransactionsGet()

Retrieves a list of all transactions for staff members belonging to the authenticated vendor. Can be filtered by a specific `staffUserId` and/or `vendorId` (store ID). If no filters are provided, it fetches transactions for all staff across all stores owned by the vendor. 

### Example

```typescript
import {
    TransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let staffUserId: string; //Optional. Filter transactions for a specific staff member. (optional) (default to undefined)
let vendorId: string; //Optional. Filter transactions for staff at a specific store. (optional) (default to undefined)

const { status, data } = await apiInstance.staffTransactionsGet(
    staffUserId,
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffUserId** | [**string**] | Optional. Filter transactions for a specific staff member. | (optional) defaults to undefined|
| **vendorId** | [**string**] | Optional. Filter transactions for staff at a specific store. | (optional) defaults to undefined|


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
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsGet**
> transactionsGet()

Retrieves a list of transactions with role-based access control: - **Vendor**: Can see all transactions from all their stores. Can filter by `vendorId` (store ID) and `userId` (customer ID). - **Store Admin**: Can only see transactions from their assigned store. Can filter by `userId` (customer ID). - **Store Shopper**: Can only see transactions they have performed (e.g., payouts, tips). 

### Example

```typescript
import {
    TransactionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionsApi(configuration);

let vendorId: string; //Optional. (Vendor only) Filter transactions for a specific store. (optional) (default to undefined)
let userId: string; //Optional. (Vendor/Store Admin) Filter transactions for a specific customer or staff member. (optional) (default to undefined)

const { status, data } = await apiInstance.transactionsGet(
    vendorId,
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. (Vendor only) Filter transactions for a specific store. | (optional) defaults to undefined|
| **userId** | [**string**] | Optional. (Vendor/Store Admin) Filter transactions for a specific customer or staff member. | (optional) defaults to undefined|


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
|**200** | A list of transactions. |  -  |
|**403** | Forbidden. User does not have permission to access the requested resources. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

