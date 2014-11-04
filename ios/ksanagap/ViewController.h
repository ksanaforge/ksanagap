//
//  ViewController.h
//  accelon
//
//  Created by yapcheahshen on 2014/10/24.
//  Copyright (c) 2014年 ksanaforge. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol UIMyWebViewDelegate <UIWebViewDelegate>
    @optional
    - (void)loadHomepage:(NSString *)appName ;
    - (void)loadApps ;
@end


@interface ViewController : UIViewController <UIMyWebViewDelegate>
@end

