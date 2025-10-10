# WalletApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**walletMeGet**](#walletmeget) | **GET** /wallet/me | Get the authenticated user\&#39;s wallet|
|[**walletMeTransactionsGet**](#walletmetransactionsget) | **GET** /wallet/me/transactions | Get the authenticated user\&#39;s transaction history|

# **walletMeGet**
> Wallet walletMeGet()

Retrieves the wallet details and balance for the currently authenticated user. If a wallet does not exist, it will be created automatically.

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Wallet**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The user\&#39;s wallet. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletMeTransactionsGet**
> Array<TransactionWithRelations> walletMeTransactionsGet()

Retrieves a list of all financial transactions for the authenticated user.

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletMeTransactionsGet();
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
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

