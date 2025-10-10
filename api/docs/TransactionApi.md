# TransactionApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**transactionsCreatePaymentIntentPost**](#transactionscreatepaymentintentpost) | **POST** /transactions/create-payment-intent | Create a Payment Intent for an order|
|[**transactionsMeGet**](#transactionsmeget) | **GET** /transactions/me | Get my transaction history|
|[**transactionsMePaymentMethodsGet**](#transactionsmepaymentmethodsget) | **GET** /transactions/me/payment-methods | Get my saved payment methods|
|[**transactionsMePaymentMethodsPaymentMethodIdDelete**](#transactionsmepaymentmethodspaymentmethodiddelete) | **DELETE** /transactions/me/payment-methods/{paymentMethodId} | Delete a saved payment method|
|[**transactionsSetupIntentPost**](#transactionssetupintentpost) | **POST** /transactions/setup-intent | Create a Setup Intent to save a new payment method|
|[**transactionsVendorGet**](#transactionsvendorget) | **GET** /transactions/vendor | Get payment transactions for a vendor user|

# **transactionsCreatePaymentIntentPost**
> TransactionsCreatePaymentIntentPost200Response transactionsCreatePaymentIntentPost(transactionsCreatePaymentIntentPostRequest)


### Example

```typescript
import {
    TransactionApi,
    Configuration,
    TransactionsCreatePaymentIntentPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let transactionsCreatePaymentIntentPostRequest: TransactionsCreatePaymentIntentPostRequest; //

const { status, data } = await apiInstance.transactionsCreatePaymentIntentPost(
    transactionsCreatePaymentIntentPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **transactionsCreatePaymentIntentPostRequest** | **TransactionsCreatePaymentIntentPostRequest**|  | |


### Return type

**TransactionsCreatePaymentIntentPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payment Intent created successfully. |  -  |
|**400** | Bad Request (e.g., order already paid). |  -  |
|**403** | Forbidden. |  -  |
|**404** | Order or User not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsMeGet**
> Array<TransactionWithRelations> transactionsMeGet()


### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

const { status, data } = await apiInstance.transactionsMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TransactionWithRelations>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s transactions. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsMePaymentMethodsGet**
> Array<SavedPaymentMethod> transactionsMePaymentMethodsGet()


### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

const { status, data } = await apiInstance.transactionsMePaymentMethodsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SavedPaymentMethod>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s saved payment methods. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsMePaymentMethodsPaymentMethodIdDelete**
> transactionsMePaymentMethodsPaymentMethodIdDelete()


### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let paymentMethodId: string; //The Stripe PaymentMethod ID (pm_...). (default to undefined)

const { status, data } = await apiInstance.transactionsMePaymentMethodsPaymentMethodIdDelete(
    paymentMethodId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymentMethodId** | [**string**] | The Stripe PaymentMethod ID (pm_...). | defaults to undefined|


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
|**204** | Payment method detached successfully. |  -  |
|**403** | Forbidden. |  -  |
|**404** | Payment method not found for this user. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsSetupIntentPost**
> TransactionsCreatePaymentIntentPost200Response transactionsSetupIntentPost()

Creates a Setup Intent to be used on the client-side for saving a new card for future use.

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

const { status, data } = await apiInstance.transactionsSetupIntentPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TransactionsCreatePaymentIntentPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Setup Intent created successfully. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | User not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **transactionsVendorGet**
> Array<TransactionWithRelations> transactionsVendorGet()

Retrieves a list of all payment-related transactions for stores owned by the authenticated vendor user. Can be filtered by a specific store.

### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let vendorId: string; //Optional. The ID of a specific store (vendor) to filter payments for. (optional) (default to undefined)

const { status, data } = await apiInstance.transactionsVendorGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | Optional. The ID of a specific store (vendor) to filter payments for. | (optional) defaults to undefined|


### Return type

**Array<TransactionWithRelations>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of payment transactions. |  -  |
|**403** | Forbidden. User is not a vendor. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

