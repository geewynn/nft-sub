import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { StickymenToys } from "../../generated/StickymenToys/StickymenToys";
import { Account, Collectible, Collection } from "../../generated/schema";

export function getOrCreateAccount(address: Address): Account {
  let accountAddress = address.toHexString();
  let account = Account.load(accountAddress);

  if (account == null) {
    account = new Account(accountAddress);
    account.address = address;
    account.save();
  }

  return account as Account;
}

export function getOrCreateCollection(address: Address): Collection {
  let collectionId = address.toHexString();
  let collection = Collection.load(collectionId);
  if (!collection) {
    collection = new Collection(collectionId);
    collection.collectionAddress = address;

    let contract = StickymenToys.bind(address);
    let nameResult = contract.try_name();
    if (!nameResult.reverted) {
      collection.collectionName = nameResult.value;
    }

    // let symbolResult = contract.try_symbol();
    // if (!symbolResult.reverted) {
    //   collection.collectionSymbol = symbolResult.value;
    // }
    collection.save();
  }
  return collection;
}

export function getOrCreateCollectible(collectionAddress: Bytes, collectionId: string, tokenId: BigInt, creatorId: string, createdTimestamp: BigInt) : Collectible {
    let collectibleId = collectionAddress.toHexString().concat("-").concat(tokenId.toHexString());
    let collectible = Collectible.load(collectibleId);
    if(!collectible){
        collectible = new Collectible(collectibleId);
        collectible.tokenId = tokenId;
        collectible.collection = collectionId;
        collectible.creator = creatorId;
        collectible.owner = creatorId;
        collectible.created = createdTimestamp;
        // collectible.descriptorUri = StickymenToys.bind(Address.fromBytes(collectionAddress)).tokenURI(tokenId);
        collectible.save();
    }
    return collectible;
}