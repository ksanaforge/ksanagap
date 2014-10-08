
#import <Foundation/Foundation.h>  
@import JavaScriptCore;  
@protocol KFSObjectExport <JSExport> 
    // @property (nonatomic, copy) NSString *name; 
/*
  -(NSNumber) open :(NSString*)fname;
  -(Nil)      close : (NSNumber) handle;  
  -(NSNumber) getFileSize :(NSNumber) handle;
  -(NSNumber) readInt32 : (NSNumber) handle : pos (NSNumber) pos;
  -(NSNumber) readUInt32 : (NSNumber) handle : pos (NSNumber) pos;
  -(NSNumber) readUInt8 : (NSNumber) handle : pos (NSNumber) pos;
  -(NSString*)readUTF8String :(NSNumber)handle :pos(NSNumber)pos : size(NSNumber)size;
  -(NSString*)readULE16String :(NSNumber)handle :pos(NSNumber)pos : size(NSNumber)size;
  -(NSArray)  readBuffer :(NSNumber)handle :pos(NSNumber)pos : size(NSNumber)size;
  -(NSArray)  readBuf_packedint :(NSNumber)handle :pos(NSNumber)pos : size(NSNumber)size : count(NSNumber)count : reset(NSNumber)reset;
  -(NSArray)  readFixedArray :(NSNumber)handle :pos(NSNumber)pos : count(NSNumber)count :unitsz(NSNumber)unitsz;
  -(NSArray)  readStringArray :(NSNumber)handle :pos(NSNumber)pos : size(NSNumber)size :enc(NSString*)enc;
*/
@end  
  
@interface FKSObject : KNSObject <KFSObjectExport>  
@end  