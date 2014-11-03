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
    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    session=[NSURLSession sessionWithConfiguration:sessionConfiguration delegate:self delegateQueue:nil];
    downloading=false;
    vc=nil;
    downloadresult=nil;
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

-(void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location{
      downloadedFiles++;
}

-(void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite{
    downloadedBytes+=bytesWritten;
}

- (void) addDownload : (NSURL*) url {
    NSURLSessionDownloadTask *downloadTask=[session downloadTaskWithURL:url];
    [downloadTask resume];
}

- (bool) startDownload :(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files {
    downloadingFiles =[files componentsSeparatedByString:@"\uffff"];
    downloadedFiles=0;
    downloadedBytes=0;
    for (int i=0;i<[downloadingFiles count];i++) {
        NSString *url=[baseurl stringByAppendingString:[downloadingFiles objectAtIndex:i]];
        NSURL *nsurl=[[NSURL alloc] initWithString:url];
        [self addDownload :nsurl];
    }
    return true;
}

-(void)cancelDownload  {
    
};
-(NSString*)doneDownload  {
    if (downloadedFiles==[downloadingFiles count]) return @"success";
    else return downloadresult;
};
-(NSNumber*)downloadedByte  {
    return [NSNumber numberWithLongLong:downloadedBytes];
}
-(NSNumber*)downloadingFile  {
    return [NSNumber numberWithInt:0];
}


@end
