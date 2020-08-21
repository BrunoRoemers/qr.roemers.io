# Bruno's QR codes


## DynamoDB
### qrDetails
- **uuid** (string) (partition key)
- **label** (string)
- **location** (string)
- **createdAt** (string)


### qrVisits
- **uuid** (string) (partition key)
- **createdAt** (string) (sort key)


### Notes
- primary key = partition key + sort key
- uuids have astronomically small chance of duplicity
  - combined with sort key, chances of duplicate primary key even smaller
- partition key should have wide range of values, evenly distributed
- sort key can easily be queried
