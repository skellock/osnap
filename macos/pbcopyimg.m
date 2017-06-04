// gcc -Wall -g -O3 -ObjC -framework Foundation -framework AppKit -o pbcopyimg pbcopyimg.m

#import <Foundation/Foundation.h>
#import <Cocoa/Cocoa.h>
#import <unistd.h>

BOOL copyToClipboard(NSString *path)
{
  // http://stackoverflow.com/questions/2681630/how-to-read-png-image-to-nsimage
  NSImage * image;
  if ([path isEqualToString:@"-"]) {
    // http://caiustheory.com/read-standard-input-using-objective-c 
    NSFileHandle *input = [NSFileHandle fileHandleWithStandardInput];
    image = [[NSImage alloc] initWithData:[input readDataToEndOfFile]];
  } else { 
    image = [[NSImage alloc] initWithContentsOfFile:path];
  }

  // http://stackoverflow.com/a/18124824/148668
  BOOL copied = false;
  if (image != nil)
  {
    NSPasteboard *pasteboard = [NSPasteboard generalPasteboard];
    [pasteboard clearContents];
    NSArray *copiedObjects = [NSArray arrayWithObject:image];
    copied = [pasteboard writeObjects:copiedObjects];
    [pasteboard release];
  }
  [image release];
  return copied;
}

int main(int argc, char * const argv[])
{
  NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
  if (argc < 2)
  {
    printf(
      "Usage:\n\n"
      "Copy file to clipboard:\n    ./pbcopyimg path/to/file\n\n"
      "Copy stdin to clipboard:\n    cat /path/to/file | ./pbcopyimg -"
    );
    return EXIT_FAILURE;
  }
  NSString *path = [NSString stringWithUTF8String:argv[1]];
  BOOL success = copyToClipboard(path);
  [pool release];
  return (success ? EXIT_SUCCESS : EXIT_FAILURE);
}
