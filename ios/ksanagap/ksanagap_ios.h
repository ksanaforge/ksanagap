#import <Foundation/Foundation.h>
@import JavaScriptCore;
@protocol KGExport <JSExport>
@property (readonly) NSString *platform;
JSExportAs(log, - (void)log:(NSString*)message);
JSExportAs(debug, - (void)debug:(NSString*)message);
JSExportAs(warn, - (void)warn:(NSString*)message);
JSExportAs(error, - (void)error:(NSString*)message);
@end

@interface ksanagap_ios: NSObject <KGExport>

@end
