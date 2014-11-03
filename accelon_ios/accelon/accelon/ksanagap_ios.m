//
//  ksanagap_ios.m
//  ksanagap
//
//  Created by yapcheahshen on 2014/10/14.
//  Copyright (c) 2014年 Hsiao Allen. All rights reserved.
//

#import "ksanagap_ios.h"

#import "ViewController.h"

@implementation ksanagap_ios

- (id)init {
    self = [super init];
    session=[NSURLSession sharedSession];
    downloading=false;
    vc=nil;
    return self;
}

-(void) setViewController : (UIViewController*)_vc {
    vc=_vc;
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
    dispatch_async(dispatch_get_main_queue(),^{
        [(ViewController*)(vc) loadHomepage:app];
    });
}
- (bool) startDownload :(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files {
    return true;
}

-(void)cancelDownload  {
    
};
-(NSString*)doneDownload  {
    return @"success";
};
-(NSNumber*)downloadedByte  {
    return [NSNumber numberWithInt:0];
}
-(NSNumber*)downloadingFile  {
    return [NSNumber numberWithInt:0];
}


@end
