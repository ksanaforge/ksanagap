#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@import JavaScriptCore;
@protocol KGExport <JSExport>
@property (readonly) NSString *platform;
@property (readwrite) UIViewController *vc;

JSExportAs(log, - (void)log:(NSString*)message);
JSExportAs(debug, - (void)debug:(NSString*)message);
JSExportAs(warn, - (void)warn:(NSString*)message);
JSExportAs(error, - (void)error:(NSString*)message);

JSExportAs(switchApp, - (void)switchApp :(NSString*) app );
JSExportAs(startDownload, -(bool)startDownload:(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files );

- (NSString*)doneDownload ;
- (NSNumber*)downloadedByte ;
- (NSNumber*)downloadingFile ;
- (void)cancelDownload ;


@end


@interface ksanagap_ios: NSObject <KGExport> {
    //@property (nonatomic,assign)
   // UIViewController *vc;

    NSURLSession *session;
    bool downloading;
    //UIViewController *vc;
    
}



@end
