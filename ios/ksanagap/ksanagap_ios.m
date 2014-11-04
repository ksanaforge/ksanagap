//
//  ksanagap_ios.m
//  ksanagap
//
//  Created by yapcheahshen on 2014/10/14.
//  Copyright (c) 2014年 Hsiao Allen. All rights reserved.
//

#import "ksanagap_ios.h"

#import "ViewController.h"

@implementation ksanagap_ios{
    NSString *rootPath;
}

-(NSString *)getFullPath :(NSString*)fn {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    documentsDirectory = [NSString stringWithFormat:@"%@/%@/", documentsDirectory, rootPath];
    //append with root
    NSString *file = [documentsDirectory stringByAppendingPathComponent:fn];
    return file;
}

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

-(boolean_t) replaceFile :(NSURL*)location replacing:(uint64_t)replacing{
    NSError *error = nil;
    NSFileManager *fm=[NSFileManager defaultManager];
    boolean_t copied=false;
    
    NSString *replaceTo =[downloadingFiles objectAtIndex:replacing];
    if ([replaceTo isEqualToString:@"ksana.js"]) {
        replaceTo=@"ksana.js!";
    }
   
    NSString *targetFile = [self getFullPath:replaceTo ];
    NSLog(@"copy %@ to %@",[location path], targetFile );
    NSURL *targetURL=[NSURL fileURLWithPath:targetFile];
    
    if ([fm fileExistsAtPath:targetFile]) {
        if ([fm replaceItemAtURL:targetURL withItemAtURL:location backupItemName:nil options:NSFileManagerItemReplacementUsingNewMetadataOnly resultingItemURL:nil error:&error]) {
            copied=true;
        } else {
            NSLog(@"%@",[error localizedDescription]);
        }
    } else {
        if ([fm moveItemAtURL:location toURL:targetURL error:&error]) {
            copied=true;
        } else {
            NSLog(@"%@",[error localizedDescription]);
        }
    }
    return copied;
}

-(void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location{
    uint64_t idx=[tasks indexOfObject:downloadTask];
    if (idx==-1) return;
    
    if ([self replaceFile :location replacing:idx]) {
        downloadedFileCount++;
    }
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
    if (downloading) return false;
    
    downloading=true;
    downloadingFiles =[files componentsSeparatedByString:@"\uffff"];
    tasks=[[NSMutableArray alloc] init];
    
    rootPath=[NSString stringWithString:dbid];
    downloadedFileCount=0;
    downloadedBytes=0;
    // [self clearTemporaryDirectory];  //system will clear Tmp folder
    
    for (int i=0;i<[downloadingFiles count];i++) {
        NSString *url=[baseurl stringByAppendingString:[downloadingFiles objectAtIndex:i]];
        NSURL *nsurl=[[NSURL alloc] initWithString:url];
        [self addDownload :nsurl];
    }
    return true;
}

-(void)cancelDownload  {
    for (int i=0;i<tasks.count;i++) {
        NSURLSessionDownloadTask *task=[tasks objectAtIndex:i];
        downloading=false;
        [task cancel];
    }
    
};

-(void)copyKsanajs {
    NSError *error;
    NSFileManager *fm=[NSFileManager defaultManager];

    NSString *targetFile = [self getFullPath:@"ksana.js" ];
    NSURL *targetURL=[NSURL fileURLWithPath:targetFile];

    NSString *sourceFile = [self getFullPath:@"ksana.js!" ];
    NSURL *sourceURL=[NSURL fileURLWithPath:sourceFile];
    
    [fm replaceItemAtURL:targetURL withItemAtURL:sourceURL backupItemName:nil options:NSFileManagerItemReplacementUsingNewMetadataOnly resultingItemURL:nil error:&error];
}
-(NSString*)doneDownload  {
    if (downloadedFileCount==downloadingFiles.count) {
        [self copyKsanajs];
        downloading=false;
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
