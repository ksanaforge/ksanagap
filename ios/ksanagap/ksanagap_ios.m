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
    NSURLRequest* req=downloadTask.currentRequest;
    NSLog(@"location %@ %@",[location absoluteString], [[req URL] absoluteString]);

    uint64_t idx=[tasks indexOfObject:downloadTask];
    if (idx==-1) return;
    
    [downloadedFiles replaceObjectAtIndex:idx withObject:location];
    downloadedFileCount++;
}

-(void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite{
   
    downloadedBytes+=bytesWritten;
}

- (void) addDownload : (NSURL*) url {
    NSURLSessionDownloadTask *downloadTask=[session downloadTaskWithURL:url];
    [tasks addObject:downloadTask];
    [downloadTask resume];
}

- (void) clearTemporaryDirectory {
    NSError *error;
    NSArray *temp=[[NSFileManager defaultManager] contentsOfDirectoryAtPath:NSTemporaryDirectory() error:&error];
    for (NSString *file in temp) {
        [[NSFileManager defaultManager] removeItemAtPath:[NSString stringWithFormat:@"%@%@",NSTemporaryDirectory(),file] error:&error];
    }
}
- (bool) startDownload :(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files {
    downloadingFiles =[files componentsSeparatedByString:@"\uffff"];
    downloadedFiles=[NSMutableArray arrayWithArray:downloadingFiles];
    tasks=[[NSMutableArray alloc] init];
    
    downloadedFileCount=0;
    downloadedBytes=0;
    [self clearTemporaryDirectory];
    for (int i=0;i<[downloadingFiles count];i++) {
        NSString *url=[baseurl stringByAppendingString:[downloadingFiles objectAtIndex:i]];
        NSURL *nsurl=[[NSURL alloc] initWithString:url];
        [self addDownload :nsurl];
    }
    return true;
}

-(void)cancelDownload  {
    
};

-(void) replaceFiles {
    NSError *error;
    
}

-(NSString*)doneDownload  {
    if (downloadedFileCount==[downloadingFiles count]) {
      [self replaceFiles];
      return @"success";
    }
    else return downloadresult;
};
-(NSNumber*)downloadedByte  {
    return [NSNumber numberWithLongLong:downloadedBytes];
}
-(NSNumber*)downloadingFile  {
    return [NSNumber numberWithInt:0];
}


@end
