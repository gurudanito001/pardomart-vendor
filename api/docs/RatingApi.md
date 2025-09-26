# RatingApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ratingsAggregateGet**](#ratingsaggregateget) | **GET** /ratings/aggregate | Get aggregate rating for a vendor or user|
|[**ratingsGet**](#ratingsget) | **GET** /ratings | Get a list of ratings|
|[**ratingsIdDelete**](#ratingsiddelete) | **DELETE** /ratings/{id} | Delete a rating|
|[**ratingsIdGet**](#ratingsidget) | **GET** /ratings/{id} | Get a single rating by ID|
|[**ratingsIdPatch**](#ratingsidpatch) | **PATCH** /ratings/{id} | Update a rating|
|[**ratingsPost**](#ratingspost) | **POST** /ratings | Create a new rating for an order|

# **ratingsAggregateGet**
> RatingsAggregateGet200Response ratingsAggregateGet()

Calculates the average rating and total count of ratings for a specific vendor, shopper, or deliverer.

### Example

```typescript
import {
    RatingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let ratedVendorId: string; //The ID of the vendor to get aggregate ratings for. (optional) (default to undefined)
let ratedUserId: string; //The ID of the user (shopper/deliverer) to get aggregate ratings for. (optional) (default to undefined)

const { status, data } = await apiInstance.ratingsAggregateGet(
    ratedVendorId,
    ratedUserId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **ratedVendorId** | [**string**] | The ID of the vendor to get aggregate ratings for. | (optional) defaults to undefined|
| **ratedUserId** | [**string**] | The ID of the user (shopper/deliverer) to get aggregate ratings for. | (optional) defaults to undefined|


### Return type

**RatingsAggregateGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The aggregate rating data. |  -  |
|**400** | Bad request (e.g., neither ratedVendorId nor ratedUserId is provided). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ratingsGet**
> Array<RatingWithRelations> ratingsGet()

Retrieves a list of ratings, with optional filters.

### Example

```typescript
import {
    RatingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let orderId: string; //Filter ratings by a specific order ID. (optional) (default to undefined)
let raterId: string; //Filter ratings by the user who submitted them. (optional) (default to undefined)
let ratedVendorId: string; //Filter ratings for a specific vendor. (optional) (default to undefined)
let ratedUserId: string; //Filter ratings for a specific user (shopper or deliverer). (optional) (default to undefined)
let type: RatingType; //Filter by the type of rating. (optional) (default to undefined)

const { status, data } = await apiInstance.ratingsGet(
    orderId,
    raterId,
    ratedVendorId,
    ratedUserId,
    type
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | Filter ratings by a specific order ID. | (optional) defaults to undefined|
| **raterId** | [**string**] | Filter ratings by the user who submitted them. | (optional) defaults to undefined|
| **ratedVendorId** | [**string**] | Filter ratings for a specific vendor. | (optional) defaults to undefined|
| **ratedUserId** | [**string**] | Filter ratings for a specific user (shopper or deliverer). | (optional) defaults to undefined|
| **type** | **RatingType** | Filter by the type of rating. | (optional) defaults to undefined|


### Return type

**Array<RatingWithRelations>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of ratings. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ratingsIdDelete**
> Rating ratingsIdDelete()

Allows a customer to delete their own rating.

### Example

```typescript
import {
    RatingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let id: string; //The ID of the rating to delete. (default to undefined)

const { status, data } = await apiInstance.ratingsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the rating to delete. | defaults to undefined|


### Return type

**Rating**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The deleted rating. |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not the original rater). |  -  |
|**404** | Rating not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ratingsIdGet**
> Rating ratingsIdGet()


### Example

```typescript
import {
    RatingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let id: string; //The ID of the rating to retrieve. (default to undefined)

const { status, data } = await apiInstance.ratingsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | The ID of the rating to retrieve. | defaults to undefined|


### Return type

**Rating**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The requested rating. |  -  |
|**404** | Rating not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ratingsIdPatch**
> Rating ratingsIdPatch(updateRatingPayload, )

Allows a customer to update their own rating for an order.

### Example

```typescript
import {
    RatingApi,
    Configuration,
    UpdateRatingPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let updateRatingPayload: UpdateRatingPayload; //
let id: string; //The ID of the rating to update. (default to undefined)

const { status, data } = await apiInstance.ratingsIdPatch(
    updateRatingPayload,
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRatingPayload** | **UpdateRatingPayload**|  | |
| **id** | [**string**] | The ID of the rating to update. | defaults to undefined|


### Return type

**Rating**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated rating. |  -  |
|**400** | Bad request (e.g., invalid rating value). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not the original rater). |  -  |
|**404** | Rating not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ratingsPost**
> Rating ratingsPost(createRatingPayload)

Allows a customer to submit a rating for a completed order. The rating can be for a VENDOR, SHOPPER, or DELIVERER. A user can only submit one rating of each type per order.

### Example

```typescript
import {
    RatingApi,
    Configuration,
    CreateRatingPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new RatingApi(configuration);

let createRatingPayload: CreateRatingPayload; //

const { status, data } = await apiInstance.ratingsPost(
    createRatingPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRatingPayload** | **CreateRatingPayload**|  | |


### Return type

**Rating**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | The created rating. |  -  |
|**400** | Bad request (e.g., invalid rating value, order not delivered). |  -  |
|**401** | Unauthorized. |  -  |
|**403** | Forbidden (user is not the customer for this order). |  -  |
|**404** | Order not found. |  -  |
|**409** | Conflict (a rating of this type already exists for this order). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

