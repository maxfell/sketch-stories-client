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

  COSImageTools.viewNSImage_inWindowNamed_(image, "Share Slice")
}
