# Bruno's QR codes


## DynamoDB
### qr-details
partition key: qr-uuid (string)
sort key: qr-label (string) (what is the qr code used for?)


## qr-visits
partition key: qr-uuid (string)
sort key: created-at (number) (when was the qr code accessed?)


### Notes
- primary key = partition key + sort key
- uuids have astronomically small chance of duplicity
  - combined with sort key, chances of duplicate primary key even smaller
- partition key should have wide range of values, evenly distributed
- sort key can easily be queried
