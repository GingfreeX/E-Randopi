<?php
/**
 * Created by Roman Belousov
 * Date: 11.04.16
 */

namespace belousovr\belousovChatBundle\EventListener;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use MainBundle\Entity\Member;

class DynamicRelationSubscriber implements EventSubscriber
{
    protected $userClass;

    public function __construct($userClass)
    {
        $this->userClass = $userClass;
    }

    /**
     * {@inheritDoc}
     */
    public function getSubscribedEvents()
    {
        return array(
            Events::loadClassMetadata,
        );
    }

    /**
     * @param LoadClassMetadataEventArgs $eventArgs
     */
    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs)
    {
        // the $metadata is the whole mapping info for this class
        $metadata = $eventArgs->getClassMetadata();

        if ($metadata->getName() != 'belousovr\belousovChatBundle\Entity\Messages') {
            return;
        }

        $metadata->mapManyToOne(
            [
                "targetEntity" => $this->userClass,
                "fieldName"    => "author",
                "referencedColumnName"   => "id"
            ]
        );

        $metadata->mapManyToOne(
            [
                "targetEntity" => Member::class,
                "fieldName"    => "addressee",
                "referencedColumnName"   => "id"
            ]
        );
    }
}