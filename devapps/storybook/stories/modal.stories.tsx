/**
 * SPDX-License-Identifier: MIT
 */
'use client';
import { Button } from '@repo/design-system/ui';
import { Input } from '@repo/design-system/ui';
import { Label } from '@repo/design-system/ui';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Basic Modal</ModalTitle>
          <ModalDescription>
            This is a basic modal with a title and description.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>
            Modal content goes here. This is the main content area of the modal.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
        <Modal key={size}>
          <ModalTrigger asChild>
            <Button variant="outline">{size} Modal</Button>
          </ModalTrigger>
          <ModalContent
            size={
              size as
                | 'xs'
                | 'sm'
                | 'md'
                | 'lg'
                | 'xl'
                | '2xl'
                | '3xl'
                | '4xl'
                | '5xl'
                | '6xl'
                | '7xl'
                | 'full'
            }
          >
            <ModalHeader>
              <ModalTitle>{size} Modal</ModalTitle>
              <ModalDescription>
                This modal has a size of {size}.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>Modal content goes here. This modal has a size of {size}.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[
        'center',
        'top-center',
        'bottom-center',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ].map((position) => (
        <Modal key={position}>
          <ModalTrigger asChild>
            <Button variant="outline">{position}</Button>
          </ModalTrigger>
          <ModalContent
            position={
              position as
                | 'center'
                | 'top-center'
                | 'bottom-center'
                | 'top-left'
                | 'top-right'
                | 'bottom-left'
                | 'bottom-right'
            }
          >
            <ModalHeader>
              <ModalTitle>{position} Position</ModalTitle>
              <ModalDescription>
                This modal is positioned at {position}.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>
                Modal content goes here. This modal is positioned at {position}.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open Form Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Login</ModalTitle>
          <ModalDescription>
            Enter your credentials to log in to your account.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="col-span-3"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Login</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const NonDismissible: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Non-dismissible Modal</Button>
      </ModalTrigger>
      <ModalContent onPointerDownOutside={(e) => e.preventDefault()}>
        <ModalHeader>
          <ModalTitle>Non-dismissible Modal</ModalTitle>
          <ModalDescription>
            This modal cannot be closed by clicking outside or pressing Escape.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>
            This modal is configured to prevent closing when clicking outside.
            You must use the close button or action buttons to close it.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalTrigger asChild>
            <Button>Close Modal</Button>
          </ModalTrigger>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const CustomBackdrop: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['none', 'sm', 'md', 'lg'] as const).map((blur) => (
        <Modal key={blur}>
          <ModalTrigger asChild>
            <Button variant="outline">Blur: {blur}</Button>
          </ModalTrigger>
          <ModalContent blur={blur}>
            <ModalHeader>
              <ModalTitle>Custom Backdrop</ModalTitle>
              <ModalDescription>
                This modal has a backdrop with blur: {blur}.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>
                Modal content goes here. The backdrop has a blur effect of{' '}
                {blur}.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
};

export const Draggable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Modal>
        <ModalTrigger asChild>
          <Button variant="outline">Draggable Modal</Button>
        </ModalTrigger>
        <ModalContent draggable>
          <ModalHeader>
            <ModalTitle>Draggable Modal</ModalTitle>
            <ModalDescription>
              You can drag this modal by clicking and dragging the header area.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>
              Click and drag the header area to move this modal around the
              screen.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal>
        <ModalTrigger asChild>
          <Button variant="outline">Draggable with Overflow</Button>
        </ModalTrigger>
        <ModalContent draggable overflow>
          <ModalHeader>
            <ModalTitle>Draggable with Overflow</ModalTitle>
            <ModalDescription>
              This modal can be dragged beyond the viewport boundaries.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>
              Click and drag the header area to move this modal. This modal can
              be dragged beyond the viewport boundaries.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  ),
};

export const ScrollBehavior: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['inside', 'outside'].map((scrollBehavior) => (
        <Modal key={scrollBehavior}>
          <ModalTrigger asChild>
            <Button variant="outline">Scroll: {scrollBehavior}</Button>
          </ModalTrigger>
          <ModalContent
            scrollBehavior={scrollBehavior as 'inside' | 'outside'}
            className="max-h-[300px]"
          >
            <ModalHeader>
              <ModalTitle>Scroll Behavior: {scrollBehavior}</ModalTitle>
              <ModalDescription>
                This modal has scroll behavior set to {scrollBehavior}.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="mb-4">
                  Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Nullam pulvinar risus non risus hendrerit
                  venenatis. Pellentesque sit amet hendrerit risus, sed
                  porttitor quam.
                </p>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </div>
  ),
};

export const NoCloseButton: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </ModalTrigger>
      <ModalContent hideCloseButton>
        <ModalHeader>
          <ModalTitle>Modal without Close Button</ModalTitle>
          <ModalDescription>
            This modal does not have a close button in the corner.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>
            Modal content goes here. This modal does not have a close button.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalTrigger asChild>
            <Button variant="outline">Close</Button>
          </ModalTrigger>
          <Button>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const NestedModals: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline">Open First Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>First Modal</ModalTitle>
          <ModalDescription>This is the first modal.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p>Click the button below to open a second modal.</p>
        </ModalBody>
        <ModalFooter>
          <Modal>
            <ModalTrigger asChild>
              <Button>Open Second Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Second Modal</ModalTitle>
                <ModalDescription>This is the second modal.</ModalDescription>
              </ModalHeader>
              <ModalBody>
                <p>This is a nested modal inside the first modal.</p>
              </ModalBody>
              <ModalFooter>
                <ModalTrigger asChild>
                  <Button variant="outline">Close</Button>
                </ModalTrigger>
                <Button>Continue</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button variant="outline">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
