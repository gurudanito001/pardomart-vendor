# SupportApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1SupportTicketsGet**](#apiv1supportticketsget) | **GET** /api/v1/support/tickets | Get all support tickets (Admin)|
|[**apiV1SupportTicketsMeGet**](#apiv1supportticketsmeget) | **GET** /api/v1/support/tickets/me | Get my support tickets|
|[**apiV1SupportTicketsPost**](#apiv1supportticketspost) | **POST** /api/v1/support/tickets | Create a new support ticket|
|[**apiV1SupportTicketsTicketIdStatusPatch**](#apiv1supportticketsticketidstatuspatch) | **PATCH** /api/v1/support/tickets/{ticketId}/status | Update a support ticket\&#39;s status (Admin)|

# **apiV1SupportTicketsGet**
> PaginatedSupportTickets apiV1SupportTicketsGet()

Retrieves a paginated list of all support tickets. Requires admin privileges.

### Example

```typescript
import {
    SupportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportApi(configuration);

let page: number; // (optional) (default to 1)
let size: number; // (optional) (default to 20)

const { status, data } = await apiInstance.apiV1SupportTicketsGet(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **size** | [**number**] |  | (optional) defaults to 20|


### Return type

**PaginatedSupportTickets**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of support tickets. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SupportTicketsMeGet**
> Array<SupportTicket> apiV1SupportTicketsMeGet()

Retrieves all support tickets submitted by the authenticated user.

### Example

```typescript
import {
    SupportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportApi(configuration);

const { status, data } = await apiInstance.apiV1SupportTicketsMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SupportTicket>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s support tickets. |  -  |
|**401** | Unauthorized. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SupportTicketsPost**
> SupportTicket apiV1SupportTicketsPost(createSupportTicketPayload)

Allows an authenticated user (customer, vendor, etc.) to submit a support ticket for issues or bugs.

### Example

```typescript
import {
    SupportApi,
    Configuration,
    CreateSupportTicketPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportApi(configuration);

let createSupportTicketPayload: CreateSupportTicketPayload; //

const { status, data } = await apiInstance.apiV1SupportTicketsPost(
    createSupportTicketPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSupportTicketPayload** | **CreateSupportTicketPayload**|  | |


### Return type

**SupportTicket**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created support ticket. |  -  |
|**400** | Bad request (e.g., invalid input). |  -  |
|**401** | Unauthorized. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SupportTicketsTicketIdStatusPatch**
> SupportTicket apiV1SupportTicketsTicketIdStatusPatch(updateSupportTicketStatusPayload, )

Updates the status of a specific support ticket. Requires admin privileges.

### Example

```typescript
import {
    SupportApi,
    Configuration,
    UpdateSupportTicketStatusPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportApi(configuration);

let updateSupportTicketStatusPayload: UpdateSupportTicketStatusPayload; //
let ticketId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1SupportTicketsTicketIdStatusPatch(
    updateSupportTicketStatusPayload,
    ticketId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateSupportTicketStatusPayload** | **UpdateSupportTicketStatusPayload**|  | |
| **ticketId** | [**string**] |  | defaults to undefined|


### Return type

**SupportTicket**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated support ticket. |  -  |
|**400** | Bad request (e.g., invalid status). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden. |  -  |
|**404** | Ticket not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

