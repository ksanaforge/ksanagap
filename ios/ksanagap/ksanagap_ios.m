//
//  ksanagap_ios.m
//  ksanagap
//
//  Created by yapcheahshen on 2014/10/14.
//  Copyright (c) 2014年 Hsiao Allen. All rights reserved.
//

#import "ksanagap_ios.h"

@implementation ksanagap_ios

- (id)init {
    self = [super init];
    return self;
}

- (NSString *) platform {
    return @"ios";
}
-(void) log : (NSString*)message {
    NSLog(@"%@",message);
}
-(void) debug : (NSString*)message {
    NSLog(@"debug %@",message);
}
-(void) error : (NSString*)message {
    NSLog(@"error %@",message);
}
-(void) warn : (NSString*)message {
    NSLog(@"warn %@",message);
}

- (void) switchApp :(NSString*) app {
    NSLog(@"switching to %@",app);
    
}
- (bool) startDownload :(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files {
    
    return false;
}

-(void)cancelDownload  {
    
};
-(NSString*)doneDownload  {
    return @"";
};
-(NSNumber*)downloadedByte  {
    return [NSNumber numberWithInt:0];
}
-(NSNumber*)downloadingFile  {
    return [NSNumber numberWithInt:0];
}


@end
