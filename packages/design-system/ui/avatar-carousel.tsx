/**
 * SPDX-License-Identifier: MIT
 */

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@repo/design-system/lib/utils"
import { Card, CardContent } from "@repo/design-system/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/design-system/ui/carousel"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/design-system/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/ui/popover"
import { Button } from "@repo/design-system/ui/button"

interface AvatarData {
  src: string
  alt: string
  fallback: string
  details?: {
    name?: string
    description?: string
  }
}

interface AvatarCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: AvatarData[]
  itemsPerPage?: number
  showPagination?: boolean
}

export function AvatarCarousel({
  avatars,
  itemsPerPage = 5,
  showPagination = true,
  className,
  ...props
}: AvatarCarouselProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [activePopover, setActivePopover] = React.useState<number | null>(null)

  const totalPages = Math.ceil(avatars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, avatars.length)
  const currentAvatars = avatars.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setActivePopover(null)
  }

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1

            // Show first page, current page, last page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            }

            // Show ellipsis for gaps
            if (
              (page === 2 && currentPage > 3) ||
              (page === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return null
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) handlePageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          {currentAvatars.map((avatar, index) => (
            <CarouselItem key={`${avatar.alt}-${startIndex + index}`}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Popover open={activePopover === index} onOpenChange={(open) => {
                      if (open) {
                        setActivePopover(index)
                      } else {
                        setActivePopover(null)
                      }
                    }}>
                      <PopoverTrigger asChild>
                        <Avatar className="h-24 w-24 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                          <AvatarImage src={avatar.src} alt={avatar.alt} />
                          <AvatarFallback>{avatar.fallback}</AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => setActivePopover(null)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar>
                            <AvatarImage src={avatar.src} alt={avatar.alt} />
                            <AvatarFallback>{avatar.fallback}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium leading-none">{avatar.details?.name || avatar.alt}</h4>
                            {avatar.details?.description && (
                              <p className="text-sm text-muted-foreground mt-1">{avatar.details.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <div className="text-sm">
                            <span className="font-medium">Profile details</span>
                            <p className="text-muted-foreground mt-1">
                              Click on the avatar to view more information about this user.
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {renderPagination()}
    </div>
  )
}
