# non-fungible-ranker

Rank your nft collection choosing the algorithm you prefer.
This package can retrieves and parse the collection metadata from different sources and rank every nft using different
score strategy.

## Install

```
npm install non-fungible-ranker
```

## Usage

```javascript
const NFR = require('non-fungible-ranker')

const options = {
    source: {
        type: 'filesystem',
        path: './inputs/json',
    },
    collection: {
        attributes: ['Background','Skin', 'Jowls', 'Mouth', 'Eyes', 'Clothes', 'Headwear'],
        supply: 10000
    },
    ranker: {
        type: 'rarityScore'
    }
}

const ranker = NFR(options)

const stats = await ranker.rankCollection()
console.log(stats)
/*
 * ...
 * { id: '1082.json', score: 0.000001280426016987394 },
 * { id: '1083.json', score: 0.0000013304025676832715 },
 * { id: '1084.json', score: 0.0000013001667264310755 },
 * { id: '1085.json', score: 0.000001254020708824398 },
 * { id: '1086.json', score: 0.0000012871439413840163 },
 * { id: '1087.json', score: 0.0000012583142946898313 },
 * ...
 */
```

### Options

Options must be an object with the following fields

```javascript
const options = {
    source: { ... },
    collection: { ... },
    ranker: { ... }
}
```

#### Source
Source fields must be used to choose and customize a *source reader*. Each source reader can have different mandatory fields.

##### Filesystem source reader:

```javascript
const source = { 
    type: 'filesystem', 
    path: '/home/user/collection/folder' 
}
```

The `path` should refer a folder in the filesystem where all the nft metadata json are stored.

#### Collection
Collection field take care of all the aspect of the nft collection.
Only the listed attributes will be used for rank the nft

```javascript
const collection = { 
    supply: 42, 
    attributes: ['Background', 'Clothes', 'Eyes', 'Fur', 'Har', 'Mouth' ]
}
```

#### Ranker
With this field you can choose and customize the rank algorithm

```javascript
const ranker = { 
    type: 'rarityScore',
}
```
Available rankers:
- traitRarity: The simpler algorithm, each nft will be scored based on his rarest trait 
- rarityScore: The commonly used algorithm, each nft will be scored based on the rarity of all his traits on the entire collection