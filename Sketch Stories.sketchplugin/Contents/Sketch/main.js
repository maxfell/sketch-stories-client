var shareSelectedSlice = function(context) {
  var selection = context.selection.firstObject()
  
  if (selection.class() != "MSSliceLayer")
      return
      
  var exportRequest = MSExportRequest.exportRequestsFromExportableLayer_inRect_useIDForName_(
    selection,
    selection.absoluteInfluenceRect(),
    false
  ).firstObject()

  exportRequest.format = "png"
  exportRequest.scale = 1.0

  var colorSpace = NSColorSpace.sRGBColorSpace()
  var exporter = MSExporter.exporterForRequest_colorSpace_(exportRequest, colorSpace)
  var imageRep = exporter.bitmapImageRep()

  var image = NSImage.alloc().init().autorelease()
  image.addRepresentation(imageRep)

  //COSImageTools.viewNSImage_inWindowNamed_(image, "Share Slice")

  var request = NSMutableURLRequest.alloc().init()
  var url = NSURL.URLWithString("https://httpbin.org/post")
  var boundary = "WebKitFormBoundary7MA4YWxkTrZu0gW"
  var contentType = "multipart/form-data; boundary=" + boundary
  
  request.setURL(url)
  request.setHTTPMethod("POST")
  request.addValue_forHTTPHeaderField(contentType, "Content-Type")
  
  var body = NSMutableData.data()

  body.appendData(NSString.stringWithFormat("\r\n--%@\r\n", boundary).dataUsingEncoding(NSUTF8StringEncoding))
  body.appendData(NSString.stringWithFormat("Content-Disposition: form-data; name=\"%@\"; filename=\"photo.png\"\r\n", "storyImage").dataUsingEncoding(NSUTF8StringEncoding))
  body.appendData(NSString.stringWithString("Content-Type: application/octet-stream\r\n\r\n").dataUsingEncoding(NSUTF8StringEncoding))
  body.appendData(NSData.dataWithData(imageRep.representationUsingType_properties(NSPNGFileType, nil)))
  body.appendData(NSString.stringWithFormat("\r\n--%@\r\n", boundary).dataUsingEncoding(NSUTF8StringEncoding))

  request.setHTTPBody(body)

  var error = NSError.alloc().init()
  var responseCode = null

  var oResponseData = NSURLConnection.sendSynchronousRequest_returningResponse_error_(request, responseCode, error)
  var dataString = NSString.alloc().initWithData_encoding_(oResponseData, NSUTF8StringEncoding)

  log("done")

  log(dataString)
}
