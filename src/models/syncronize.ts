export function synchronize(model) {
  return model.createMapping(function (err, mapping) {
    if (err) {
      console.log("error creating mapping (you can safely ignore this)");
      console.log(err);
    } else {
      console.log("mapping created!");

      var stream = model.synchronize();
      var count = 0;

      stream.on("data", function (err, doc) {
        count++;
      });
      stream.on("close", function () {
        console.log("[ElasticSearch] Indexed " + count + " " + " documents!");
      });
      stream.on("error", function (err) {
        console.log("mongoosastic ERROR");
        console.log(err);
      });
    }
  });
}
