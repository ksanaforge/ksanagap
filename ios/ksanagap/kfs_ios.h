
#import <Foundation/Foundation.h>
@import JavaScriptCore;
//@protocol FSObjectExport <JSExport>
//-(void)log:(NSString*)string;

//@end

@interface kfs_ios: NSObject // <JSExport>
-(void) setRoot : (NSString*)root;

-(NSString*) readSignature:(NSString*)par;


@end
