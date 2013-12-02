# Node API for [RWElephant](http://www.rwelephant.com/)

RWElephant provides a public API, but it doesn't provide all of the information you might need. This logs into the same inventory system you would use from your browser.

This uses promises because those apparently those are cool now.

## Supported Methods

I've only added what I've needed so far.

* `login`
* `list_inventory_types`
* `list_inventory_items_by_type`
* `inventory_item_detail_for_id`

## Example

```js
var RWElephant = require('rwelephant')

var rwe = new RWElephant({
  domain: 'example', // https://example.rwelephant.com
  username: 'username',
  password: 'password'
});

rwe.login()
  .then(function(sessionID) {
    // list all inventory types
    return rwe.list_inventory_types();
  })
  .then(function(inventoryTypes) {
    console.log(inventoryTypes);
  })
  .done();
```
