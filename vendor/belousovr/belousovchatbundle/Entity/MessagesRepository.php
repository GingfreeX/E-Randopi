<?php
/**
 * Created by Roman Belousov
 * Date: 08.04.16
 */
namespace belousovr\belousovChatBundle\Entity;

use Doctrine\ORM\EntityRepository;

class MessagesRepository extends EntityRepository
{
    public function getMessages($user, $addressee)
    {
        $query = $this->getEntityManager()
            ->createQuery('
                SELECT
                m, a, u
                FROM
                belousovChatBundle:Messages m
                JOIN
                m.author u
                JOIN
                m.addressee a
                WHERE
                (m.author = :author AND m.addressee = :addressee) OR (m.author = :addressee AND m.addressee = :author)
                ORDER BY m.id
            ');

        $query->setParameters(array('author' => $user, 'addressee' => $addressee));

        return $query->getArrayResult();
    }

    public function getMessageLongPolling($user, $addressee)
    {
        $em = $this->getEntityManager();

        $query = $em
            ->createQuery('
                SELECT
                m, a, u
                FROM
                belousovChatBundle:Messages m
                JOIN
                m.author u
                JOIN
                m.addressee a
                WHERE
                ((m.author = :author AND m.addressee = :addressee) OR (m.author = :addressee AND m.addressee = :author)) AND m.reading = :reading
                ORDER BY m.id
            ');

        $query->setParameters(array('author' => $user, 'addressee' => $addressee, 'reading' => '0'));

        return $query;
    }
}