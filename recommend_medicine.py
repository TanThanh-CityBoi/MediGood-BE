from pymongo import MongoClient

# Formula: dosageFormSet x 1 + producer x 1 + price x 5 + origin x 2 + category x 3 + age x 4
def computeSimilarity(products):
  matrix = []
  
  for i in range(len(products)):
    dictSave = {}
    dictSave["productId"] = str(products[i]["_id"])
    dictSave["similarMatrix"] = []
    for j in range(len(products)):
      dosageFormSimilarVal = 0
      if products[i]["dosageForm"] == products[j]["dosageForm"]:
        dosageFormSimilarVal = 1
      
      producerSimilarVal = 0;
      if products[i]["producer"] == products[j]["producer"]:
        producerSimilarVal = 1

      priceSimilarVal = 0
      priceDiffVal = abs(products[i]["price"] - products[j]["price"])
      if priceDiffVal <= 1000:
        priceSimilarVal = 1
      else:
        priceSimilarVal = 1000 / priceDiffVal

      originSimilarVal = 0
      if products[i]["origin"] == products[j]["origin"]:
        originSimilarVal = 1

      categorySimilarVal = 0
      if products[i]["category"] == products[j]["category"]:
        categorySimilarVal = 1

      ageSimilarVal = 0
      ageDiffVal = abs(round((products[i]["age"][0] - products[j]["age"][0])*0.7 + (products[i]["age"][1] - products[j]["age"][1])*0.3, 5))
      if ageDiffVal == 0:
        ageSimilarVal = 1
      else:
        ageSimilarVal = 1/ageDiffVal

      # matrixTempt.append( ageSimilarVal*3)
      similarVal = round(producerSimilarVal*1 + dosageFormSimilarVal*1 + priceSimilarVal*5 + originSimilarVal*2+ categorySimilarVal*3+ ageSimilarVal*3,5)
      
      
      dictSave["similarMatrix"].append({
        "productCompareId": str(products[j]["_id"]),
        "similarVal": similarVal
      })
      # matrixTempt.append(dosageFormVal*1)
      # matrixTempt.append(originDiffVal)
    matrix.append(dictSave)
  return matrix

connection_string = "mongodb+srv://medigood:G9wAUarEmf3VhEDy@medi-good.gqmkfau.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_string)
db = client['test']

productCursor = db.get_collection("products").find({})
products = []
for i in productCursor:
  products.append(i)

similarMatrix = db["similarityMatrix"]
similarMatrix.drop()
similarMatrix.insert_many(computeSimilarity(products))