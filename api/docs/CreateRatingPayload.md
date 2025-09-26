# CreateRatingPayload

When creating a rating, either `ratedVendorId` or `ratedUserId` must be provided depending on the `type`.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **string** | The ID of the order being rated. | [default to undefined]
**rating** | **number** | The rating score from 1 to 5. | [default to undefined]
**comment** | **string** | An optional comment for the rating. | [optional] [default to undefined]
**type** | [**RatingType**](RatingType.md) |  | [default to undefined]
**ratedVendorId** | **string** | Required if type is VENDOR. | [optional] [default to undefined]
**ratedUserId** | **string** | Required if type is SHOPPER or DELIVERER. | [optional] [default to undefined]

## Example

```typescript
import { CreateRatingPayload } from './api';

const instance: CreateRatingPayload = {
    orderId,
    rating,
    comment,
    type,
    ratedVendorId,
    ratedUserId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
