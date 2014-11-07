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

-(NSString*)getAppDirectory: (NSString*) appname {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    documentsDirectory = [NSString stringWithFormat:@"%@/%@/", documentsDirectory, appname];
    return documentsDirectory;
}
-(NSString *)getFullPath :(NSString*)fn {
    //append with root
    NSString *appDirectory=[self getAppDirectory:rootPath];
    NSString *file = [appDirectory stringByAppendingPathComponent:fn];
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
        [(ViewController*)(vc) loadApps];
        [(ViewController*)(vc) loadHomepage:app];
    });
}
-(boolean_t) copyFile:(NSURL*)source target:(NSString*)targetFile {
    NSError *error = nil;
    NSFileManager *fm=[NSFileManager defaultManager];
    
    boolean_t copied=false;
    NSURL *targetURL=[NSURL fileURLWithPath:targetFile];
   
    NSString *folder=[[targetURL path] stringByDeletingLastPathComponent];
    if (![fm fileExistsAtPath:folder]) {
       if (![fm createDirectoryAtPath:folder withIntermediateDirectories:YES attributes:nil error:&error]) {
           NSLog(@"%@",[error localizedDescription]);
           return 0;
       }
    }
    if ([fm copyItemAtURL:source toURL:targetURL error:&error]) {
        copied=true;
    } else {
        NSLog(@"%@",[error localizedDescription]);
    }
    return copied;
}


-(boolean_t) moveFile :(NSURL*)source target:(NSString*)targetFile {
    NSError *error = nil;
    NSFileManager *fm=[NSFileManager defaultManager];
    
    boolean_t moved=false;
    NSURL *targetURL=[NSURL fileURLWithPath:targetFile];

    if ([fm fileExistsAtPath:targetFile]) {
        if ([fm replaceItemAtURL:targetURL withItemAtURL:source backupItemName:nil options:NSFileManagerItemReplacementUsingNewMetadataOnly resultingItemURL:nil error:&error]) {
            moved=true;
        } else {
            NSLog(@"%@",[error localizedDescription]);
        }
    } else {
        NSString *folder=[[targetURL path] stringByDeletingLastPathComponent];
        if (![fm fileExistsAtPath:folder]) {
            if (![fm createDirectoryAtPath:folder withIntermediateDirectories:YES attributes:nil error:&error]) {
                NSLog(@"%@",[error localizedDescription]);
                return 0;
            }
        }
        if ([fm moveItemAtURL:source toURL:targetURL error:&error]) {
            moved=true;
        } else {
            NSLog(@"%@",[error localizedDescription]);
        }
    }
    return moved;
}
-(boolean_t) replaceWith :(NSURL*)location replacing:(uint64_t)replacing{
    boolean_t moved=false;
    NSString *replaceTo =[downloadingFiles objectAtIndex:replacing];
    if ([replaceTo isEqualToString:@"ksana.js"]) {
        replaceTo=@"ksana.js!";
    }
   
    NSString *targetFile = [self getFullPath:replaceTo ];
    NSLog(@"copy %@ to %@",[location path], targetFile );
    moved=[self moveFile :location target:targetFile];
    
    return moved;
}

-(void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location{
    uint64_t idx=[tasks indexOfObject:downloadTask];
    if (idx==-1) return;
    
    if ([self replaceWith :location replacing:idx]) {
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


- (NSString*) getDownloadUrl : (NSString*)baseurl  filename:(NSString*)filename {
    if ([filename hasPrefix:@"http://"]) return filename;
    else return [baseurl stringByAppendingString:filename];
}


- (bool) startDownload :(NSString*) dbid baseurl:(NSString*)baseurl files:(NSString*)files {
    if (downloading) return false;
    
    downloading=true;
    NSArray *files_ =[files componentsSeparatedByString:@"\uffff"];
    downloadingFiles = [files_ mutableCopy ];
    tasks=[[NSMutableArray alloc] init];
    
    rootPath=[NSString stringWithString:dbid];
    downloadedFileCount=0;
    downloadedBytes=0;
    // [self clearTemporaryDirectory];  //system will clear Tmp folder
    
    for (int i=0;i<[downloadingFiles count];i++) {
        NSString *filename=[downloadingFiles objectAtIndex:i];
        NSString *defaulturl=[baseurl stringByAppendingString:filename];
        NSString *url=[self getDownloadUrl:baseurl filename:filename];
        if (![defaulturl isEqualToString:url]) {
            //runtime_version 1.3 support filename with host
            NSString *hostremoved=[filename substringFromIndex: [url length] - [filename length] ];
            [downloadingFiles replaceObjectAtIndex:i withObject:hostremoved];
        }
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

-(NSString*)runtime_version  {
    return @"1.3";
}
@end
